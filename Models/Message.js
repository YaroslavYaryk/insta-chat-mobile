class Message {
  constructor(
    id,
    conversation,
    from_user,
    to_user,
    content,
    timestamp,
    read,
    edited,
    forwarded,
    images,
    likes,
    parent,
    ref,
    scroll
  ) {
    this.id = id;
    this.conversation = conversation;
    this.from_user = from_user;
    this.to_user = to_user;
    this.content = content;
    this.timestamp = timestamp;
    this.read = read;
    this.edited = edited;
    this.forwarded = forwarded;
    this.images = images;
    this.likes = likes;
    this.parent = parent;
    this.ref = ref;
    this.scroll = scroll;
  }
}

export default Message;
