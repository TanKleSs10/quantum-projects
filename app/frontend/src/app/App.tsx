import { Route, Routes } from 'react-router'
import ToastProvider from '@/components/ToastProvider'
import AuthLayout from '@/components/layouts/AuthLayout'
import Dashboard from '@/pages/Dashboard'
import Forbidden from '@/pages/Forbidden'
import NotFound from '@/pages/NotFound'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ResetPassword from '@/pages/auth/ResetPassword'
import VerifyEmail from '@/pages/auth/VerifyEmail'
import VerifyEmailToken from '@/pages/auth/VerifyEmailToken'
import Settings from '@/pages/Settings'
import Teams from '@/pages/Teams'
import CreateTeam from '@/pages/CreateTeam'
import TeamOverview from '@/pages/TeamOverview'
import TeamSettings from '@/pages/TeamSettings'
import TeamMembers from '@/pages/TeamMembers'
import Projects from '@/pages/Projects'
import CreateProject from '@/pages/CreateProject'
import ProjectOverview from '@/pages/ProjectOverview'
import EditProject from '@/pages/EditProject'
import Tasks from '@/pages/Tasks'
import CreateTask from '@/pages/CreateTask'
import TaskOverview from '@/pages/TaskOverview'
import AuthGuard from './guards/AuthGuard'
import GuestGuard from './guards/GuestGuard'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<GuestGuard />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="verify-email/:token" element={<VerifyEmailToken />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/teams/:teamId/project/create" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectOverview />} />
            <Route path="/projects/:projectId/edit" element={<EditProject />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects/:projectId/task/create" element={<CreateTask />} />
            <Route path="/tasks/:taskId" element={<TaskOverview />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/create" element={<CreateTeam />} />
          <Route path="/teams/:teamId" element={<TeamOverview />} />
          <Route path="/teams/:teamId/members" element={<TeamMembers />} />
          <Route path="/teams/:teamId/settings" element={<TeamSettings />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastProvider />
    </>
  )
}
