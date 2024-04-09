import React from 'react'
import SignIn from '../../components/LoginForm/LoginForm';
import styles from './_loginPage.module.css'
import { Button } from '@mui/material';

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
        
        <SignIn />
    </div>
  )
}

export default LoginPage