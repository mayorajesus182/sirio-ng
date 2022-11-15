import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import { JwtService } from './jwt.service';


export function socketProvider() {
    return new SockJS(`${environment.api['websocket']}`);
}

@Injectable({
    providedIn: 'root',
})
export class SocketService {

    public notify = new BehaviorSubject<boolean>(false);
    private stompClient = undefined;
    private connecting: boolean = false;
    private topicQueue: any[] = [];
private headers = {};
    socket = new SockJS(`${environment.api['websocket']}`);
    // socket = Stomp.over(() => new SockJS(`${environment.api['websocket']}`));
    
    
    constructor(private jwtService: JwtService) {
        // this.stompClient = Stomp.over(() => new SockJS(`${environment.api['websocket']}`));
        this.stompClient = Stomp.over(this.socket);

        this.stompClient.reconnectDelay = 5000;
        this.stompClient.heartbeat.outgoing = 2000;
        this.stompClient.debug=undefined;
        this.headers['Authorization'] = 'Bearer '+this.jwtService.getToken();

    }

    subscribe(topic: string, callback: any): void {
        // console.log('topic ', topic);
        
        // If stomp client is currently connecting add the topic to the queue
        if (this.connecting) {
            // console.log('connecting ', topic);
            this.topicQueue.push({
                topic,
                callback
            });
            return;
        }

        const connected: boolean = this.stompClient.connected;
        if (connected) {
            // Once we are connected set connecting flag to false
            this.connecting = false;
            this.subscribeToTopic(topic, callback);
            return;
        }

        // If stomp client is not connected connect and subscribe to topic
        this.connecting = true;
        this.stompClient.connect(this.headers, (): any => {
            this.subscribeToTopic(topic, callback);

            // Once we are connected loop the queue and subscribe to remaining topics from it
            this.topicQueue.forEach((item: any) => {
                this.subscribeToTopic(item.topic, item.callback);
            })

            // Once done empty the queue
            this.topicQueue = [];
        });
    }

    private subscribeToTopic(topic: string, callback: any): void {
        this.stompClient.subscribe(topic, (response?: string): any => {
            // console.log('socket message response ',response);
            
            callback(response);
        });
    }
}
