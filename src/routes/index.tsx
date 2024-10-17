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
import { Showcase } from '../pages/Showcase';
import TreatmentEditor from '../pages/TreatmentEditor';
import { NotFoundPage } from '../pages/404';
import { Questionaries } from '../pages/Questionaries';
import { FAQ } from '../pages/FAQ';
import { Terms } from '../pages/Terms';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { Reports } from '@/pages/Reports';
import { Credits } from '@/pages/Credits';
import { PatientsList } from '@/pages/PatientsList/PatientsList';

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
        <Route path="/questionaries" Component={Questionaries} />
        <Route path="/treatment" Component={Treatment} />
        <Route path="/blocks" Component={Blocks} />
        <Route path="/questions" Component={Questions} />
        <Route path="/replies" Component={Replies} />
        <Route path="/treatments-table" Component={TreatmentsTable} />
        <Route
          path="/treatment-editor/:treatmentId?"
          Component={TreatmentEditor}
        />
        <Route path="/users" Component={Users} />
        <Route path="/patients" Component={PatientsList} />
        <Route path="/reports/:patientId" Component={Reports} />
        <Route path="/profile" Component={Profile} />
        <Route path="/faq" Component={FAQ} />
        <Route path="/terms" Component={Terms} />
        <Route path="/privacy-policy" Component={PrivacyPolicy} />
        <Route path="/credits" Component={Credits} />

        {isDevEnv && <Route path="/showcase" Component={Showcase} />}

        <Route path="*" Component={NotFoundPage} />
      </Route>
    </Routes>
  );
}
