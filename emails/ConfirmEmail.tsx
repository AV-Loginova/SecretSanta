import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
} from '@react-email/components';

interface ConfirmEmailProps {
  name?: string;
  confirmUrl: string;
}

export const ConfirmEmail = ({ name, confirmUrl }: ConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>Подтвердите вашу почту</Preview>
    <Body
      style={{ backgroundColor: '#f0f2f5', fontFamily: 'Roboto, sans-serif' }}
    >
      <Section
        style={{
          textAlign: 'center',
          padding: '40px 0',
          backgroundColor: '#374769',
        }}
      >
        <Img
          src="https://tlr.stripocdn.email/content/guids/CABINET_d9e64e61bd5ab14658ef0c95d79249160dd08cb38b25b963906cfe6c64bad7ae/images/2342343242x.png"
          alt="Secret Santa"
          width="200"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </Section>

      <Section
        style={{
          backgroundColor: '#fbf3ea',
          padding: '40px 20px',
          borderRadius: '8px',
          margin: '20px',
        }}
      >
        <Container style={{ textAlign: 'center' }}>
          <Text
            style={{ fontSize: '28px', fontWeight: 700, marginBottom: '10px' }}
          >
            Secret Santa для лучших друзьяшек
          </Text>
          <Img
            src="https://tlr.stripocdn.email/content/guids/CABINET_d9e64e61bd5ab14658ef0c95d79249160dd08cb38b25b963906cfe6c64bad7ae/images/star.png"
            alt="star"
            width="50"
            style={{ margin: '10px auto' }}
          />
          <Text style={{ fontSize: '20px', margin: '10px 0' }}>
            Успешная регистрация
          </Text>

          <Text style={{ fontSize: '16px', margin: '20px 0' }}>
            Привет{name ? `, ${name}` : ''}!<br />
            Начни с <u>заполнения</u> своего профиля и добавления крутых штучек
            в свой <u>вишлист</u>.
          </Text>

          <Button
            href={confirmUrl}
            style={{
              backgroundColor: '#008c7c',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '24px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Вернуться
          </Button>
        </Container>
      </Section>

      <Section
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#555',
          padding: '20px',
        }}
      >
        <Text>
          Если это письмо настигло тебя по ошибке, нажми <u>сюда</u>, чтобы
          больше не получать наших писем.
        </Text>
      </Section>

      <Section style={{ textAlign: 'center', padding: '20px' }}>
        <Img
          src="https://tlr.stripocdn.email/content/guids/cab_pub_7cbbc409ec990f19c78c75bd1e06f215/images/78411525331495932.png"
          alt="Made with love"
          width="100"
        />
      </Section>
    </Body>
  </Html>
);
