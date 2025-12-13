import { useCallback, useEffect, useState } from 'react';
import { DefaultLayout } from '../../../layouts';

import { App, Typography } from 'antd';
import { useAuth } from '../../../stores/auth';
import axios, { AxiosError } from 'axios';

const { Title, Text } = Typography;

export default function BalancePage() {
  const [data, setData] = useState<{
    account_number: number | null;
    balance: number | null;
  }>({ account_number: null, balance: null });
  const cred = useAuth((state) => state.cred);
  const { message } = App.useApp();

  const getBalance = useCallback(
    async (token: string | null) => {
      if (!token) return;

      try {
        const response = await axios.get(
          'http://localhost:8000/transaction/balance',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const accountData = response?.data?.data;
        setData(accountData);
      } catch (err) {
        if (err instanceof AxiosError) {
          message.error(err.response?.data?.message);
          return;
        }

        message.error('Unknown error occured');
      }
    },
    [message]
  );

  useEffect(() => {
    getBalance(cred);
  }, [cred, getBalance]);
  return (
    <DefaultLayout>
      <main>
        <Title level={2}>Balance</Title>

        <section>
          <Text>
            Your current balance in account number{' '}
            <strong>{data?.account_number || '-'}</strong> is:
          </Text>
          <Title level={4} style={{ marginTop: 0 }}>
            Rp. {data?.balance || 0}
          </Title>
        </section>
      </main>
    </DefaultLayout>
  );
}
