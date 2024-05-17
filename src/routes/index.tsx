import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Signup } from '../pages/Signup';
import { ResetPassword } from '../pages/ResetPassword';
import { Users } from '../pages/Users';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginLayout } from '../layout/LoginLayout';
import { DefaultLayout } from '../layout/DefaultLayout';
import { Questionary } from '../pages/Questionary';
import { Profile } from '../pages/Profile';
import { Treatment } from '../pages/Treatment';
import { Blocks } from '../pages/Questionaries/Blocks';
import { Questions } from '../pages/Questionaries/Questions';
import { Replies } from '../pages/Questionaries/Replies';
import { TreatmentsTable } from '../pages/TreatmentsTable';
import { TreatmentReply } from '../pages/TreatmentsTable/Replies';
import { Showcase } from '../pages/Showcase';

const isDevEnv = import.meta.env.DEV;

export function Router() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute isPrivate={false}>
            <LoginLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/login" Component={Login} />
        <Route path="/sign-up" Component={Signup} />
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/reset-password" Component={ResetPassword} />
      </Route>
      <Route
        element={
          <ProtectedRoute isPrivate>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" Component={Home} />
        <Route path="/questionary" Component={Questionary} />
        <Route path="/treatment" Component={Treatment} />
        <Route path="/blocks" Component={Blocks} />
        <Route path="/questions" Component={Questions} />
        <Route path="/replies" Component={Replies} />
        <Route path="/treatments-table" Component={TreatmentsTable} />
        <Route
          path="/treatments-table/:treatmentId/replies"
          Component={TreatmentReply}
        />
        <Route path="/users" Component={Users} />
        <Route path="/profile" Component={Profile} />
        {isDevEnv && <Route path="/showcase" Component={Showcase} />}
      </Route>
    </Routes>
  );
}
