import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Image,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'order';
  orderRef?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantType: 'farmer' | 'customer';
  farmName?: string;
  isVerified?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantId: '1',
    participantName: 'John Peterson',
    participantAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    participantType: 'farmer',
    farmName: 'Green Valley Farm',
    isVerified: true,
    lastMessage: 'Your tomatoes are ready for pickup!',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'conv2',
    participantId: '2',
    participantName: 'Maria Santos',
    participantAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    participantType: 'farmer',
    farmName: 'Sunny Acres',
    isVerified: true,
    lastMessage: 'The strawberries will be harvested tomorrow',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'conv3',
    participantId: 'cust1',
    participantName: 'Alex Thompson',
    participantAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    participantType: 'customer',
    lastMessage: 'Thanks for the quick delivery!',
    lastMessageTime: '3h ago',
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'm1',
      senderId: '1',
      receiverId: 'me',
      content: 'Hi! Thanks for your order of organic tomatoes.',
      timestamp: '10:30 AM',
      read: true,
      type: 'text',
    },
    {
      id: 'm2',
      senderId: 'me',
      receiverId: '1',
      content: 'Thank you! When will they be ready?',
      timestamp: '10:32 AM',
      read: true,
      type: 'text',
    },
    {
      id: 'm3',
      senderId: '1',
      receiverId: 'me',
      content: 'They\'re being harvested today. Should be ready by tomorrow morning!',
      timestamp: '10:35 AM',
      read: true,
      type: 'text',
    },
    {
      id: 'm4',
      senderId: '1',
      receiverId: 'me',
      content: 'Your tomatoes are ready for pickup!',
      timestamp: '2:15 PM',
      read: false,
      type: 'text',
    },
    {
      id: 'm5',
      senderId: '1',
      receiverId: 'me',
      content: 'I\'ve also included some fresh basil as a thank you for being a loyal customer 🌿',
      timestamp: '2:16 PM',
      read: false,
      type: 'text',
    },
  ],
};

interface MessagesChatProps {
  userType?: 'farmer' | 'customer';
}

const MessagesChat: React.FC<MessagesChatProps> = ({ userType = 'customer' }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      receiverId: selectedConversation.participantId,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.farmName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileChat(true);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <div className="h-[600px] flex bg-card rounded-xl border border-border overflow-hidden">
      {/* Conversations List */}
      <div
        className={`w-full md:w-80 border-r border-border flex flex-col ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.participantAvatar} />
                    <AvatarFallback>{conv.participantName[0]}</AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {conv.participantType === 'farmer' ? conv.farmName : conv.participantName}
                    </span>
                    {conv.isVerified && (
                      <Leaf className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground w-5 h-5 p-0 flex items-center justify-center text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          !showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.participantAvatar} />
                  <AvatarFallback>{selectedConversation.participantName[0]}</AvatarFallback>
                </Avatar>
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {selectedConversation.participantType === 'farmer'
                      ? selectedConversation.farmName
                      : selectedConversation.participantName}
                  </span>
                  {selectedConversation.isVerified && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {selectedConversation.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMe = message.senderId === 'me';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isMe
                            ? 'bg-gradient-primary text-white rounded-br-none'
                            : 'bg-secondary text-foreground rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 ${
                            isMe ? 'justify-end' : ''
                          }`}
                        >
                          <span className={`text-xs ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {message.timestamp}
                          </span>
                          {isMe && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-white/70" />
                            ) : (
                              <Check className="w-3 h-3 text-white/70" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="bg-gradient-primary text-white"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation to start chatting with farmers or customers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesChat;
