interface Message {
  id: string;
  message: string;
  user: {
    uid: string;
    displayName: string;
  };
  createdAt: {
    nanoseconds: number;
    seconds: number;
  };
  updatedAt: {
    nanoseconds: number;
    seconds: number;
  };
  isEdited: false;
}
