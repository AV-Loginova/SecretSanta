import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Button,
} from '@react-email/components';

export const ResetPasswordEmail = ({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}) => (
  <Html>
    <Head />
    <Preview>Сброс пароля</Preview>
    <Body>
      <Container>
        <Text>Привет{name ? `, ${name}` : ''}!</Text>
        <Text>Чтобы сбросить пароль, нажмите кнопку:</Text>
        <Button href={resetUrl}>Сбросить пароль</Button>
        <Text>Ссылка действует 1 час.</Text>
      </Container>
    </Body>
  </Html>
);
