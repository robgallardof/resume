"use client";

import { FiPhone, FiMail, FiGlobe, FiGithub, FiLinkedin } from "react-icons/fi";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

/**
 * Renders the "Contact" section of the resume.
 *
 * Displays contact information such as phone, email, website, GitHub, and LinkedIn using icons and accessible links.
 *
 * @returns {JSX.Element} Rendered contact section or null if empty.
 */
export default function ContactSection(): JSX.Element {
  const { t } = useTranslation();

  const contact = {
    phone: t("personal.phone"),
    email: t("personal.email"),
    website: t("personal.website"),
    github: t("personal.github"),
    linkedin: t("personal.linkedin"),
  };

  const iconClass = "w-4 h-4 text-primary shrink-0";
  const itemClass =
    "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors truncate print:text-black";

  const renderItem = (
    key: string,
    icon: JSX.Element,
    label: string,
    href?: string
  ) => {
    if (!label) return null;

    const display = label.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return href ? (
      <a
        key={key}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
      >
        {icon}
        {display}
      </a>
    ) : (
      <span key={key} className={itemClass}>
        {icon}
        {label}
      </span>
    );
  };

  const items = [
    renderItem(
      "phone",
      <FiPhone className={iconClass} />,
      contact.phone,
      `tel:${contact.phone.replace(/\s+/g, "")}`
    ),
    renderItem(
      "email",
      <FiMail className={iconClass} />,
      contact.email,
      `mailto:${contact.email}`
    ),
    renderItem(
      "website",
      <FiGlobe className={iconClass} />,
      contact.website,
      contact.website
    ),
    renderItem(
      "github",
      <FiGithub className={iconClass} />,
      contact.github,
      contact.github
    ),
    renderItem(
      "linkedin",
      <FiLinkedin className={iconClass} />,
      contact.linkedin,
      contact.linkedin
    ),
  ].filter(Boolean);

  return (
    <section className="w-full space-y-2">
      <h2 className="text-lg font-semibold text-primary tracking-tight">
        {t("sections.contactTitle", "Contact")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{items}</div>
    </section>
  );
}
