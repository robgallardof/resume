import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Resume } from "@/lib/resume";
import { pdfSafe as s } from "@/lib/pdf-text";

/**
 * Real, text-based A4 PDF of the résumé (selectable text, clickable links, automatic page breaks),
 * laid out like the web page: header band, sidebar and main column.
 */

const VIOLET = "#6d28d9";
const INK = "#1e293b";
const MUTED = "#64748b";
const SIDEBAR_BG = "#f8fafc";
const SIDEBAR_WIDTH = 178;

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 8.6, color: INK, paddingTop: 26, paddingBottom: 16 },
  sidebarBg: { position: "absolute", top: 0, bottom: 0, left: 0, width: SIDEBAR_WIDTH, backgroundColor: SIDEBAR_BG },
  header: { backgroundColor: VIOLET, color: "#ffffff", paddingHorizontal: 32, paddingTop: 2, paddingBottom: 22 },
  // Fills the page's top padding with the header colour on page 1 only.
  headerBleed: { position: "absolute", top: 0, left: 0, right: 0, height: 26, backgroundColor: VIOLET },
  name: { fontFamily: "Helvetica-Bold", fontSize: 24, letterSpacing: 0.2 },
  title: { fontSize: 10.5, marginTop: 6, color: "#ede9fe" },
  location: { fontSize: 8.6, marginTop: 6, color: "#ddd6fe" },
  body: { flexDirection: "row" },
  sidebar: { width: SIDEBAR_WIDTH, paddingHorizontal: 18, paddingTop: 18 },
  main: { flex: 1, paddingHorizontal: 22, paddingTop: 18 },
  sideTitle: { fontFamily: "Helvetica-Bold", fontSize: 7.4, color: MUTED, letterSpacing: 1.2, marginBottom: 6, marginTop: 12 },
  mainTitle: { fontFamily: "Helvetica-Bold", fontSize: 9, color: VIOLET, letterSpacing: 1.2, marginBottom: 5, marginTop: 11, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: "#ddd6fe" },
  link: { color: INK, textDecoration: "none" },
  contactItem: { marginBottom: 3.5 },
  contactLabel: { fontFamily: "Helvetica-Bold", fontSize: 6.8, color: MUTED },
  skillGroup: { marginBottom: 6 },
  skillCategory: { fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 },
  skillItems: { color: "#475569", fontSize: 7.8 },
  small: { fontSize: 7.8, color: MUTED },
  strong: { fontFamily: "Helvetica-Bold" },
  job: { marginBottom: 9 },
  jobHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobRole: { fontFamily: "Helvetica-Bold", fontSize: 9.4, flex: 1, paddingRight: 8 },
  jobCompany: { color: VIOLET },
  period: { fontSize: 7.6, color: VIOLET, fontFamily: "Helvetica-Bold" },
  bulletRow: { flexDirection: "row", marginTop: 2.6 },
  bullet: { width: 8, color: VIOLET },
  bulletText: { flex: 1, color: "#334155" },
  project: { marginBottom: 5 },
  certRow: { flexDirection: "row", flexWrap: "wrap" },
  // Spacing above, not below: a trailing margin on the last row can spill an empty page.
  cert: { width: "50%", paddingRight: 8, paddingTop: 4 },
  content: { flexGrow: 1 },
  // No lineHeight anywhere: react-pdf's paginated layout mis-measures it (huge gaps, extra pages).
  prose: { color: "#334155" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginLeft: SIDEBAR_WIDTH + 22, marginRight: 22, paddingTop: 10, fontSize: 7, color: MUTED },
});

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow} wrap={false}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{s(children)}</Text>
    </View>
  );
}

export default function ResumeDocument({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const contact = [
    { label: "Email", value: p.email, href: `mailto:${p.email}` },
    { label: resume.lang === "es" ? "Teléfono" : "Phone", value: p.phone, href: `tel:${p.phone.replace(/\s+/g, "")}` },
    { label: "Web", value: p.website.replace(/^https?:\/\//, ""), href: p.website },
    { label: "LinkedIn", value: p.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: p.linkedin },
    { label: "GitHub", value: p.github.replace(/^https?:\/\//, ""), href: p.github },
  ];

  return (
    <Document
      title={`${p.name} — CV`}
      author={p.name}
      subject={s(p.title)}
      keywords=".NET, C#, Software Architecture, Full Stack, AI"
      language={resume.lang}
      creator={p.name}
      producer={p.name}
    >
      <Page
        size="A4"
        style={styles.page}
        // Page chrome: sidebar background, page-1 header bleed and the footer with page numbers.
        layout={({ children, pageNumber, totalPages }) => (
          <>
            <View style={styles.sidebarBg} />
            {pageNumber === 1 && <View style={styles.headerBleed} />}
            <View style={styles.content}>{children}</View>
            <View style={styles.footer}>
              <Text>
                {s(p.name)} · {p.website.replace(/^https?:\/\//, "")}
              </Text>
              <Text>{`${resume.labels.page} ${pageNumber} ${resume.labels.of} ${totalPages}`}</Text>
            </View>
          </>
        )}
      >

        <View style={styles.header}>
          <Text style={styles.name}>{s(p.name)}</Text>
          <Text style={styles.title}>{s(p.title)}</Text>
          <Text style={styles.location}>{s(p.location)}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.sidebar}>
            <Text style={styles.sideTitle}>{s(resume.contactTitle).toUpperCase()}</Text>
            {contact.map((c) => (
              <View key={c.label} style={styles.contactItem}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Link src={c.href} style={styles.link}>
                  {s(c.value)}
                </Link>
              </View>
            ))}

            <Text style={styles.sideTitle}>{s(resume.skills.title).toUpperCase()}</Text>
            {resume.skills.groups.map((group) => (
              <View key={group.category} style={styles.skillGroup} wrap={false}>
                <Text style={styles.skillCategory}>{s(group.category)}</Text>
                <Text style={styles.skillItems}>{s(group.items.join(" · "))}</Text>
              </View>
            ))}

            <Text style={styles.sideTitle}>{s(resume.languages.title).toUpperCase()}</Text>
            {resume.languages.items.map((lang) => (
              <Text key={lang.name} style={{ marginBottom: 2 }}>
                <Text style={styles.strong}>{s(lang.name)}</Text> — {s(lang.level)}
              </Text>
            ))}

            <Text style={styles.sideTitle}>{s(resume.education.title).toUpperCase()}</Text>
            {resume.education.items.map((edu) => (
              <View key={edu.degree} style={{ marginBottom: 6 }} wrap={false}>
                <Text style={styles.strong}>{s(edu.degree)}</Text>
                <Text style={styles.small}>{s(edu.institution)}</Text>
                <Text style={styles.period}>{s(edu.period)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.main}>
            <Text style={styles.mainTitle}>{s(resume.about.title).toUpperCase()}</Text>
            <Text style={styles.prose}>{s(resume.about.text)}</Text>

            <Text style={styles.mainTitle}>{s(resume.experience.title).toUpperCase()}</Text>
            {resume.experience.jobs.map((job) => (
              <View key={`${job.company}-${job.period}`} style={styles.job}>
                <View style={styles.jobHead} wrap={false}>
                  <Text style={styles.jobRole}>
                    {s(job.role)} <Text style={styles.jobCompany}>· {s(job.company)}</Text>
                  </Text>
                  <Text style={styles.period}>{s(job.period)}</Text>
                </View>
                {job.details.map((detail) => (
                  <Bullet key={detail}>{detail}</Bullet>
                ))}
              </View>
            ))}

            <Text style={styles.mainTitle} minPresenceAhead={60}>
              {s(resume.projects.title).toUpperCase()}
            </Text>
            <Text style={[styles.small, { marginBottom: 4 }]}>
              {s(resume.projects.role)} · {s(resume.projects.period)}
            </Text>
            {resume.projects.items.map((project) => (
              <View key={project.name} style={styles.project} wrap={false}>
                <Link src={project.url} style={[styles.link, styles.strong, { color: VIOLET }]}>
                  {s(project.name)}
                </Link>
                <Text style={styles.prose}>{s(project.description)}</Text>
              </View>
            ))}

            <Text style={styles.mainTitle} minPresenceAhead={60}>
              {s(resume.certifications.title).toUpperCase()}
            </Text>
            <View style={styles.certRow}>
              {resume.certifications.items.map((cert) => (
                <View key={`${cert.issuer}-${cert.name}`} style={styles.cert} wrap={false}>
                  {cert.url ? (
                    <Link src={cert.url} style={[styles.link, styles.strong]}>
                      {s(cert.name)}
                    </Link>
                  ) : (
                    <Text style={styles.strong}>{s(cert.name)}</Text>
                  )}
                  <Text style={styles.small}>
                    {s(cert.issuer)} · {cert.year}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
}
