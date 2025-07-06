
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to landing page since that's our main page now
  return <Navigate to="/" replace />;
};

export default Index;
