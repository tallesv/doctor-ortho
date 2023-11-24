import { Routes, Route } from 'react-router-dom';
//import Route from './Route';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Signup } from '../pages/Signup';
import { ResetPassword } from '../pages/ResetPassword';
import { Users } from '../pages/Users';

export function Router() {
  return (
    <Routes>
      <Route path="/login" Component={Login} />
      <Route path="/sign-up" Component={Signup} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/reset-password" Component={ResetPassword} />

      <Route path="/" Component={Home} />
      <Route path="/users" Component={Users} />
    </Routes>
  );
}
