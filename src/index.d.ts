
interface Message {
  id: string;
  message: string;
  user: {
    uid: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
  isEdited: false;
}

