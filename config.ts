export const config = {
  authentication_url: "http://localhost:8083",
  signup_url: "http://localhost:8083/signup",
  password_url: "http://localhost:8083/password",
  oauth2_url: "http://localhost:8083/oauth2",
  my_privileges_url: "http://localhost:8083/my-privileges",

  user_url: "http://localhost:8083/users",
  role_url: "http://localhost:8083/roles",
  privilege_url: "http://localhost:8083/privileges",
  audit_log_url: "http://localhost:8083/audit-logs",

  article_url: "http://localhost:8083/articles",
  job_url: "http://localhost:8083/jobs",
}

export const env = {
  sit: {
    authentication_url: "http://10.1.0.234:3003",
  },
  deploy: {
    authentication_url: "/server",
  },
}
