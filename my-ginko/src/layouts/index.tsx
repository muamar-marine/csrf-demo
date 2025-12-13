import './style.css';

import {
  CreditCardOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Divider, Dropdown, Layout, Menu, type MenuProps } from 'antd';
import companyLogo from '../assets/logo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import { useAuth } from '../stores/auth';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type DefaultLayoutProps = {
  children?: ReactNode;
};

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const activeMenu = pathname?.replace(/^\//, '');
  const { setCred, setUserData, userData } = useAuth();

  const navigate = useNavigate();
  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      onClick: () => {
        navigate(`/${key}`);
      },
    };
  };

  const items: MenuItem[] = [
    getItem('Home', '', <HomeOutlined />),
    getItem('Balance', 'transaction/balance', <DollarCircleOutlined />),
    getItem('Transfer', 'transaction/transfer', <CreditCardOutlined />),
    getItem(
      'Transfer (Unsafe)',
      'transaction/transfer-unsafe',
      <CreditCardOutlined />
    ),
  ];

  const handleLogout = () => {
    setUserData(null);
    setCred(null);
    localStorage.removeItem('cred');
  };

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      <Sider theme="light" className="g-default-layout__sider" width={280}>
        <img
          src={companyLogo}
          className="g-default-layout__sider__logo"
          alt="Company Logo"
        />
        <Divider size="small" />
        <Menu
          className="g-default-layout__sider__menu"
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="g-default-layout__header">
          <div className="g-default-layout__header__wrap">
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                style: { width: 160 },
                items: [
                  {
                    key: 'logout',
                    label: 'Logout',
                    onClick: () => handleLogout(),
                    icon: <LogoutOutlined />,
                  },
                ],
              }}>
              <div className="g-default-layout__user">
                <Avatar style={{ verticalAlign: 'middle' }}>
                  {userData?.name?.[0] || '-'}
                </Avatar>
                <p>{userData?.name || '-'}</p>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '16px 32px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};
