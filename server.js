import { createServer } from 'node:http'
import { createYoga, createSchema } from 'graphql-yoga'

// ポートフォリオ用のデータ
const profile = {
  name: "Tominaga Shoyo",
  role: "Developer",
  bio: "Web開発とデータベース構築を中心に学習中。フロントエンドからバックエンドまで一貫した開発を目指しています。",
  githubUrl: "https://github.com",
};

const skills = [
  { id: "1", name: "HTML5/CSS3", category: "FRONTEND", level: "ADVANCED", icon: "fa-brands fa-html5", color: "#e34f26" },
  { id: "2", name: "JavaScript", category: "FRONTEND", level: "INTERMEDIATE", icon: "fa-brands fa-js", color: "#f7df1e" },
  { id: "3", name: "SQL", category: "BACKEND", level: "INTERMEDIATE", icon: "fa-solid fa-database", color: "#00758f" },
  { id: "4", name: "Git / Git Bash", category: "TOOLS", level: "INTERMEDIATE", icon: "fa-brands fa-git-alt", color: "#f05032" },
  { id: "5", name: "GraphQL", category: "BACKEND", level: "BEGINNER", icon: "fa-solid fa-network-wired", color: "#e10098" },
  { id: "6", name: "基本情報技術者試験", category: "LICENSE", level: "CERTIFIED", icon: "fa-solid fa-award", color: "#d4af37" },
  { id: "7", name: "Python3", category: "BACKEND", level: "INTERMEDIATE", icon: "fa-brands fa-python", color: "#3776ab" },
];

const projects = [
  {
    id: "p1",
    title: "My Portfolio",
    description: "GraphQLとNode.jsを活用した動的なポートフォリオサイト",
    techStack: ["HTML", "CSS", "JavaScript", "GraphQL"],
    githubUrl: "https://github.com/Tomi-Sho/MyPortfolio",
    featured: true,
  },
  {
    id: "p2",
    title: "LINE天気通知Bot",
    description: "PythonとGitHubを利用したLINE天気通知Bot",
    techStack: ["Python"],
    githubUrl: "https://github.com/Tomi-Sho/school-assignments/tree/main/weather_line_bot",
    featured: false,
  },
];

// GraphQL スキーマ定義
const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Profile {
      name: String!
      role: String!
      bio: String!
      githubUrl: String!
    }

    type Skill {
      id: ID!
      name: String!
      category: String!
      level: String!
      icon: String!
      color: String!
    }

    type Project {
      id: ID!
      title: String!
      description: String!
      techStack: [String!]!
      githubUrl: String
      featured: Boolean!
    }

    type Query {
      profile: Profile!
      skills(category: String): [Skill!]!
      projects(featuredOnly: Boolean): [Project!]!
      project(id: ID!): Project
    }
  `,
  resolvers: {
    Query: {
      profile: () => profile,
      skills: (_, { category }) => {
        if (category) {
          return skills.filter(s => s.category === category);
        }
        return skills;
      },
      projects: (_, { featuredOnly }) => {
        if (featuredOnly) {
          return projects.filter(p => p.featured);
        }
        return projects;
      },
      project: (_, { id }) => projects.find(p => p.id === id),
    },
  },
});

const yoga = createYoga({ schema })
const server = createServer(yoga)

server.listen(4000, () => {
  console.log('🚀 Portfolio GraphQL Server running on http://localhost:4000/graphql')
})