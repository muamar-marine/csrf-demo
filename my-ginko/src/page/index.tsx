import { Typography } from 'antd';
import { DefaultLayout } from '../layouts';

const { Title,Text } = Typography;

export default function HomePage() {
  return (
    <DefaultLayout>
      <main>
        <Title level={2}>Home</Title>

        <section>
          <Text>
            Welcome to Lorem Ipsum Bank.
          </Text>
          
        </section>
      </main>
    </DefaultLayout>
  );
}
