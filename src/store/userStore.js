import { makeAutoObservable } from 'mobx';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

class UserStore {
  user = {};

  loadingUser = true;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    if (this.user?.uid) {
      return true;
    }
    return false;
  }

  logout = async () => {
    try {
      await signOut();
      this.user = null;
    } catch (error) {
      toast.error('failed to logout');
    }
  };
}

const userStore = new UserStore();

export default userStore;
