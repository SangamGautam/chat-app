import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthenticationService } from '../../services/authentication.service';

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

  constructor(private authService: AuthenticationService) {}

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

    this.socket.on('chat message', (msg: { sender: string, content: string, username: string }) => {
      const type = msg.sender === this.authService.currentUserValue._id ? 'sent' : 'received';
      const senderName = type === 'sent' ? 'You' : msg.username;
      this.messages.push({ sender: senderName, content: msg.content, type });
    });

    this.socket.on('user joined', (message: string) => {
      this.messages.push({ sender: 'System', content: message, type: 'received' });
    });

    this.socket.on('user left', (message: string) => {
      this.messages.push({ sender: 'System', content: message, type: 'received' });
    });

    if (this.currentGroup) {
      this.joinChannel(this.currentGroup);
    }
  }

  sendMessage(): void {
    if (this.currentMessage.trim() === '') return;
  
    const userId = this.authService.currentUserValue._id;  
    this.socket.emit('send message', { content: this.currentMessage, group: this.currentGroup, sender: userId });
    this.currentMessage = '';
  }

  joinChannel(channel: string): void {
    if (this.socket) {
      const userId = this.authService.currentUserValue._id;
      this.socket.emit('join channel', { group: channel, userId: userId });
      
      if (!this.joinedChannels.includes(channel)) {
        this.joinedChannels.push(channel);
        this.messages.push({ sender: 'System', content: `You joined ${channel}`, type: 'received' });
      }
    } else {
      console.error("Socket is not initialized.");
    }
  }

  leaveChannel(channel: string | null): void {
    if (!channel) return;

    const userId = this.authService.currentUserValue._id;
    this.socket.emit('leave channel', { group: channel, userId: userId });
    
    const index = this.joinedChannels.indexOf(channel);
    if (index > -1) {
      this.joinedChannels.splice(index, 1);
      this.messages.push({ sender: 'System', content: `You left ${channel}`, type: 'received' });
    }
  }
}
