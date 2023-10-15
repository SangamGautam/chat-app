import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() currentGroup: string | null = null;
  private socket!: Socket;
  public messages: { sender: string, content: string, type: 'sent' | 'received' }[] = [];
  public joinedChannels: string[] = [];
  public currentMessage: string = '';

  ngOnInit(): void {
    this.initializeSocket();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentGroup'] && this.currentGroup && this.socket) {
      this.joinChannel(this.currentGroup);
    }
  }

  initializeSocket(): void {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('chat message', (msg: { sender: string, content: string }) => {
      const type = msg.sender === 'You' ? 'sent' : 'received';
      this.messages.push({ ...msg, type });
    });

    this.socket.on('user joined', (channel: string) => {
      this.messages.push({ sender: 'System', content: `User joined ${channel}`, type: 'received' });
    });

    this.socket.on('user left', (channel: string) => {
      this.messages.push({ sender: 'System', content: `User left ${channel}`, type: 'received' });
    });

    if (this.currentGroup) {
      this.joinChannel(this.currentGroup);
    }
  }

  sendMessage(): void {
    if (this.currentMessage.trim() === '') return;

    this.socket.emit('chat message', { content: this.currentMessage, group: this.currentGroup });
    this.messages.push({ sender: 'You', content: this.currentMessage, type: 'sent' });
    this.currentMessage = ''; 
  }

  joinChannel(channel: string): void {
    if (this.socket) {
      this.socket.emit('join channel', channel);
      this.joinedChannels.push(channel);
      this.messages.push({ sender: 'System', content: `You joined ${channel}`, type: 'received' });
    } else {
      console.error("Socket is not initialized.");
    }
  }

  leaveChannel(channel: string | null): void {
    if (!channel) return;

    this.socket.emit('leave channel', channel);
    const index = this.joinedChannels.indexOf(channel);
    if (index > -1) {
      this.joinedChannels.splice(index, 1);
    }
    this.messages.push({ sender: 'System', content: `You left ${channel}`, type: 'received' });
  }
}
