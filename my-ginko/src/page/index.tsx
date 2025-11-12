import { useLocation } from 'react-router-dom';

export default function HomePage() {
  const { pathname } = useLocation();

  return <main>Hello from Home Page. Pathname: {pathname}</main>;
}
