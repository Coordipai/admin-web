export const projectData = [
  {
    status_code: 0,
    content: {
      message: "Project fetched successfully",
      timestamp: "2025-05-10T14:00:00.000Z",
      data: {
        id: 1,
        name: "Frontend Dashboard",
        owner: {
          id: 101,
          name: "Alice",
          discord_id: 123456789,
          github_id: 1001,
          github_name: "alice-dev",
          category: "Frontend",
          career: "2 years",
          created_at: "2024-12-01T10:00:00.000Z",
          profile_img: "https://example.com/alice.png"
        },
        repo_fullname: "team/frontend-dashboard",
        start_date: "2024-12-01T00:00:00.000Z",
        end_date: "2025-07-01T00:00:00.000Z",
        sprint_unit: 5,
        discord_channel_id: 987654321,
        members: [
          {
            name: "Alice",
            github_id: 1001,
            github_name: "alice-dev",
            category: "Frontend",
            role: "Lead",
            profile_img: "https://example.com/alice.png"
          },
          {
            name: "Ethan",
            github_id: 1002,
            github_name: "ethan-ui",
            category: "Frontend",
            role: "Developer",
            profile_img: "https://example.com/ethan.png"
          }
        ],
        categories: [
          {
            categoryName: "Frontend",
            people: [
              {
                userName: "Alice",
                githubId: "alice-dev",
                image: "https://example.com/alice.png"
              },
              {
                userName: "Ethan",
                githubId: "ethan-ui",
                image: "https://example.com/ethan.png"
              }
            ]
          }
        ],
        iteration: {
          sprint: "11",
          period: "3.18 ~ 3.22"
        }
      }
    }
  },
  {
    status_code: 0,
    content: {
      message: "Project fetched successfully",
      timestamp: "2025-05-10T14:00:00.000Z",
      data: {
        id: 2,
        name: "Backend API System",
        owner: {
          id: 102,
          name: "Bob",
          discord_id: 223456789,
          github_id: 2001,
          github_name: "bob-api",
          category: "Backend",
          career: "3 years",
          created_at: "2025-01-01T09:00:00.000Z",
          profile_img: "https://example.com/bob.png"
        },
        repo_fullname: "team/backend-api",
        start_date: "2025-01-01T00:00:00.000Z",
        end_date: "2025-06-30T00:00:00.000Z",
        sprint_unit: 7,
        discord_channel_id: 123456789,
        members: [
          {
            name: "Bob",
            github_id: 2001,
            github_name: "bob-api",
            category: "Backend",
            role: "Lead",
            profile_img: "https://example.com/bob.png"
          },
          {
            name: "Nina",
            github_id: 2002,
            github_name: "nina-db",
            category: "Backend",
            role: "DBA",
            profile_img: "https://example.com/nina.png"
          }
        ],
        categories: [
          {
            categoryName: "Backend",
            people: [
              {
                userName: "Bob",
                githubId: "bob-api",
                image: "https://example.com/bob.png"
              },
              {
                userName: "Nina",
                githubId: "nina-db",
                image: "https://example.com/nina.png"
              }
            ]
          }
        ],
        iteration: {
          sprint: "8",
          period: "4.15 ~ 4.21"
        }
      }
    }
  },
  {
    status_code: 0,
    content: {
      message: "Project fetched successfully",
      timestamp: "2025-05-10T14:00:00.000Z",
      data: {
        id: 3,
        name: "AI Recommendation Engine",
        owner: {
          id: 103,
          name: "Clara",
          discord_id: 323456789,
          github_id: 3001,
          github_name: "clara-ai",
          category: "AI",
          career: "1 year",
          created_at: "2025-02-10T12:00:00.000Z",
          profile_img: "https://example.com/clara.png"
        },
        repo_fullname: "team/ai-engine",
        start_date: "2025-02-10T00:00:00.000Z",
        end_date: "2025-08-01T00:00:00.000Z",
        sprint_unit: 10,
        discord_channel_id: 456789123,
        members: [
          {
            name: "Clara",
            github_id: 3001,
            github_name: "clara-ai",
            category: "AI",
            role: "ML Engineer",
            profile_img: "https://example.com/clara.png"
          },
          {
            name: "Victor",
            github_id: 3002,
            github_name: "victor-ml",
            category: "AI",
            role: "Researcher",
            profile_img: "https://example.com/victor.png"
          }
        ],
        categories: [
          {
            categoryName: "AI",
            people: [
              {
                userName: "Clara",
                githubId: "clara-ai",
                image: "https://example.com/clara.png"
              },
              {
                userName: "Victor",
                githubId: "victor-ml",
                image: "https://example.com/victor.png"
              }
            ]
          }
        ],
        iteration: {
          sprint: "6",
          period: "4.25 ~ 5.04"
        }
      }
    }
  }
]
