export interface CommitActorEntity {
  name: string;
  email: string;
  date: string;
}

export type RepoCommits = {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: CommitVerification;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: CommitAuthor;
  committer: CommitCommiter;
  parents: Array<CommitParent>;
};

export type CommitParent = {
  sha: string;
  url: string;
  html_url: string;
};

export type CommitAuthor = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
};

export type CommitCommiter = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
};

export type CommitDetail = {
  sha: string;
  node_id: string;
  commit: {
    author: CommitActorEntity;
    committer: CommitActorEntity;
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: CommitVerification;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: CommitAuthor;
  committer: CommitCommiter;
  parents: Array<CommitParent>;
  stats: CommitStats;
  files: Array<CommitFile>;
};

export type CommitStats = {
  total: number;
  additions: number;
  deletions: number;
};

export type CommitFile = {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
};

export type CommitVerification = {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
  verified_at: string | null;
};
