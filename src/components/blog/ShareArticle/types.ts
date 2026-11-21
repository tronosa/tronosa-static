export interface ShareArticleLabels {
  heading: string;
  share: string;
  copyLink: string;
  copied: string;
  copyFailed: string;
  linkedin: string;
  facebook: string;
  more: string;
}

export interface ShareArticleProps {
  url: string;
  title: string;
  labels: ShareArticleLabels;
}
