import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  unsubscribeUrl: string
  cheatsheetUrl?: string
}

export function WelcomeEmail({
  unsubscribeUrl,
  cheatsheetUrl = 'https://seekvana.com/cheatsheet.pdf',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You're in — your free AI cheatsheet is ready</Preview>
      <Body style={{ backgroundColor: '#FAF8F3', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
          {/* Header */}
          <Section style={{ textAlign: 'center', paddingBottom: '24px' }}>
            <Text style={{ fontSize: '22px', fontWeight: '600', color: '#1C1B19', margin: 0 }}>
              Seekvana
            </Text>
            <Text style={{ fontSize: '13px', color: '#6F6B62', margin: '4px 0 0' }}>
              Learn AI, clearly.
            </Text>
          </Section>

          {/* Main card */}
          <Section style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E6E1D7', padding: '40px 36px' }}>
            <Heading style={{ fontSize: '28px', color: '#1C1B19', fontWeight: '500', margin: '0 0 12px', lineHeight: '1.3' }}>
              You&apos;re in! 🎉
            </Heading>
            <Text style={{ fontSize: '16px', color: '#6F6B62', lineHeight: '1.7', margin: '0 0 24px' }}>
              Welcome to Seekvana — your weekly guide to AI, clearly explained.
              Every Tuesday you&apos;ll get new articles, AI tool picks, and practical guides.
            </Text>

            <Text style={{ fontSize: '15px', color: '#1C1B19', fontWeight: '600', margin: '0 0 12px' }}>
              Your free cheatsheet is ready:
            </Text>

            <Button
              href={cheatsheetUrl}
              style={{
                backgroundColor: '#C9633F',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Download AI Cheatsheet →
            </Button>

            <Hr style={{ borderColor: '#E6E1D7', margin: '32px 0' }} />

            <Text style={{ fontSize: '14px', color: '#6F6B62', lineHeight: '1.6', margin: 0 }}>
              In the meantime, explore our most popular articles:
            </Text>
            <Text style={{ fontSize: '14px', margin: '8px 0 0' }}>
              <Link href="https://seekvana.com/library/agentic-ai/what-is-an-agent" style={{ color: '#C9633F' }}>
                What is an AI Agent?
              </Link>
              {' · '}
              <Link href="https://seekvana.com/library/agentic-ai/rag-explained" style={{ color: '#C9633F' }}>
                RAG Without the Hype
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: 'center', padding: '24px 0' }}>
            <Text style={{ fontSize: '12px', color: '#A39E92', margin: 0 }}>
              You&apos;re receiving this because you signed up at seekvana.com.
            </Text>
            <Text style={{ fontSize: '12px', color: '#A39E92', margin: '4px 0 0' }}>
              <Link href={unsubscribeUrl} style={{ color: '#A39E92' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
