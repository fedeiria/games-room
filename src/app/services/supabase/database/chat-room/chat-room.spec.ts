import { TestBed } from '@angular/core/testing';

import { ChatRoom } from './chat-room';

describe('ChatRoom', () => {
  let service: ChatRoom;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoom);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
