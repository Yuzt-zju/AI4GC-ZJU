import type { Metadata } from "next";
import ContentSection from "@/components/layout/ContentSection";
import LinkChip from "@/components/site/LinkChip";
import TeamMemberCard from "@/components/site/TeamMemberCard";
import {
  TEAM_GROUP_LABELS,
  TEAM_MEMBER_START_LABELS,
  TEAM_OPENINGS_LABEL,
  TEAM_PI_LABEL,
} from "@/lib/content/constants";
import { TEAM_GROUPS } from "@/lib/content/paths";
import type { TeamGroup } from "@/lib/content/paths";
import { getTeamContent } from "@/lib/content";
import { buildListPageMetadata } from "@/lib/site/page-metadata";
import type { TeamMember } from "@/types/lab";

export function generateMetadata(): Metadata {
  return buildListPageMetadata("team", "/team");
}

function TeamGroup({
  title,
  members,
  group,
  compact = false,
}: {
  title: string;
  members: TeamMember[];
  group: TeamGroup;
  compact?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <section className="research-group">
      <h2 className="section-title-lg">{title}</h2>
      <ul className={`member-grid${compact ? " member-grid--dense" : ""}`}>
        {members.map((member) => (
          <li key={member.id} className="member-grid__item">
            <TeamMemberCard
              member={member}
              startDateLabel={TEAM_MEMBER_START_LABELS[group]}
              compact={compact}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TeamPage() {
  const team = getTeamContent();

  return (
    <main>
      <ContentSection className="section-page-body">
        <section className="research-group">
          <h2 className="section-title-lg">{TEAM_PI_LABEL}</h2>
          <TeamMemberCard member={team.pi} featured />
        </section>

        {TEAM_GROUPS.map((group) => (
          <TeamGroup
            key={group}
            title={TEAM_GROUP_LABELS[group]}
            members={team[group]}
            group={group}
            compact={group === "alumni"}
          />
        ))}

        {team.openings ? (
          <section className="research-group">
            <h2 className="section-title-lg">{TEAM_OPENINGS_LABEL}</h2>
            <p className="prose-copy prose-copy--muted">{team.openings}</p>
            {team.openingsForm ? (
              <div className="site-link-chip-list">
                <LinkChip link={team.openingsForm} />
              </div>
            ) : null}
          </section>
        ) : null}
      </ContentSection>
    </main>
  );
}
