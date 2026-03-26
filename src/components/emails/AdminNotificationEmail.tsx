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
  Link
} from "@react-email/components";
import * as React from "react";

interface AdminNotificationEmailProps {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  date: string;
  time: string;
  modality: string;
  intakeData?: {
    age?: number;
    weight?: number;
    height?: number;
    objective?: string;
    diagnosed_diseases?: string;
    medications?: string;
    physical_activity?: string;
    previous_nutritionist_visit?: string | boolean;
  };
}

export const AdminNotificationEmail = ({ 
  patientName, 
  patientEmail, 
  patientPhone, 
  serviceName, 
  date, 
  time, 
  modality,
  intakeData
}: AdminNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nuevo Turno: {patientName} - {serviceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>¡Tienes un nuevo turno!</Heading>
          </Section>
          <Section style={section}>
            <Text style={text}>
              Se ha registrado una nueva reserva de nutricion:
            </Text>

            <div style={card}>
              <Text style={detailText}><strong>Paciente:</strong> {patientName}</Text>
              <Text style={detailText}><strong>Email:</strong> {patientEmail}</Text>
              <Text style={detailText}><strong>Teléfono:</strong> <Link href={`https://wa.me/+54${patientPhone}`}>{patientPhone}</Link></Text>
              <Hr style={innerHr} />
              <Text style={detailText}><strong>Servicio:</strong> {serviceName}</Text>
              <Text style={detailText}><strong>Modalidad:</strong> {modality}</Text>
              <Text style={detailText}><strong>Fecha:</strong> {date}</Text>
              <Text style={detailText}><strong>Hora:</strong> {time}</Text>
            </div>

            {intakeData && (
              <div style={card}>
                <Heading style={h2}>Ficha de Primera Consulta</Heading>
                <div style={grid}>
                  <div style={gridItem}>
                    <Text style={label}>Edad</Text>
                    <Text style={value}>{intakeData.age ?? '-'} años</Text>
                  </div>
                  <div style={gridItem}>
                    <Text style={label}>Peso</Text>
                    <Text style={value}>{intakeData.weight ?? '-'} kg</Text>
                  </div>
                  <div style={gridItem}>
                    <Text style={label}>Altura</Text>
                    <Text style={value}>{intakeData.height ?? '-'} cm</Text>
                  </div>
                </div>
                <Hr style={innerHr} />
                <Text style={detailText}><strong>Objetivo:</strong> {intakeData.objective || '-'}</Text>
                <Text style={detailText}><strong>Enfermedades:</strong> {intakeData.diagnosed_diseases || '-'}</Text>
                <Text style={detailText}><strong>Medicamentos:</strong> {intakeData.medications || '-'}</Text>
                <Text style={detailText}><strong>Act. Física:</strong> {intakeData.physical_activity || '-'}</Text>
                <Text style={detailText}><strong>¿Consultó antes?:</strong> {intakeData.previous_nutritionist_visit === 'si' ? 'Sí' : 'No'}</Text>
              </div>
            )}

            <Text style={text}>
              Puedes ver más detalles y gestionar tus turnos en el panel de administración.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Admin Notifications
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
  backgroundColor: "#064e3b",
  borderRadius: "16px 16px 0 0",
  marginTop: "-20px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const h2 = {
  color: "#064e3b",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 15px",
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

const detailText = {
  color: "#1f2937",
  fontSize: "15px",
  margin: "10px 0",
};

const innerHr = {
  borderColor: "#e6ebf1",
  margin: "15px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const grid = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  marginBottom: "15px",
};

const gridItem = {
  flex: "1 0 30%",
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e6ebf1",
};

const label = {
  fontSize: "10px",
  fontWeight: "bold" as const,
  color: "#8898aa",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const value = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#064e3b",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
