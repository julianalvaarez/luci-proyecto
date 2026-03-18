import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Link,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface ConfirmationEmailProps {
  patientName: string;
  serviceName: string;
  date: string;
  time: string;
  location?: string;
  modality: string;
}

export const ConfirmationEmail = ({
  patientName,
  serviceName,
  date,
  time,
  location,
  modality,
}: ConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmación de tu turno con Lic. Luciana Cresia</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>¡Turno Confirmado!</Heading>
          </Section>
          <Section style={section}>
            <Text style={text}>Hola <strong>{patientName}</strong>,</Text>
            <Text style={text}>
              Tu turno ha sido reservado con éxito. Aquí tienes los detalles de tu consulta:
            </Text>

            <div style={card}>
              <Row style={row}>
                <Column style={labelCol}>Servicio:</Column>
                <Column style={valueCol}><strong>{serviceName}</strong></Column>
              </Row>
              <Row style={row}>
                <Column style={labelCol}>Modalidad:</Column>
                <Column style={valueCol}><strong>{modality}</strong></Column>
              </Row>
              <Row style={row}>
                <Column style={labelCol}>Fecha:</Column>
                <Column style={valueCol}><strong>{date}</strong></Column>
              </Row>
              <Row style={row}>
                <Column style={labelCol}>Hora:</Column>
                <Column style={valueCol}><strong>{time}</strong></Column>
              </Row>
              {location && (
                <Row style={row}>
                  <Column style={labelCol}>Lugar:</Column>
                  <Column style={valueCol}><strong>{location}</strong></Column>
                </Row>
              )}
            </div>

            <Text style={text}>
              Si necesitas cancelar o reprogramar, por favor avísanos con al menos 24 horas de anticipación.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Lic. Luciana Cresia - Nutricionista Clínica
            </Text>
            <Text style={footerText}>
              © 2026 Reservas. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "16px",
  border: "1px solid #e6ebf1",
};

const header = {
  padding: "32px",
  textAlign: "center" as const,
  backgroundColor: "#10b981",
  borderRadius: "16px 16px 0 0",
  marginTop: "-20px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const section = {
  padding: "24px 32px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const card = {
  margin: "24px 0",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  border: "1px solid #f0f0f0",
};

const row = {
  padding: "8px 0",
};

const labelCol = {
  color: "#8898aa",
  fontSize: "14px",
  width: "100px",
};

const valueCol = {
  color: "#1f2937",
  fontSize: "15px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
