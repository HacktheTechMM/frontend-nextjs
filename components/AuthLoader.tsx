'use client';
import { fetchUser } from '@/redux/slices/userSlice';
import { useAppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AuthLoader = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return null; // it just runs the auth logic, no UI
};

export default AuthLoader;
