import { create } from 'zustand'
import { differenceInDays } from 'date-fns'

const calculateIteration = (startDate, sprintUnit) => {
  const start = new Date(startDate)
  const today = new Date()
  const daysPassed = differenceInDays(today, start)

  const sprintIndex = Math.floor(daysPassed / sprintUnit) + 1

  const sprintStart = new Date(start)
  sprintStart.setDate(sprintStart.getDate() + (sprintIndex - 1) * sprintUnit)

  const sprintEnd = new Date(sprintStart)
  sprintEnd.setDate(sprintStart.getDate() + sprintUnit - 1)

  const format = (d) => `${d.getMonth() + 1}.${d.getDate()}`

  return {
    iteration: {
      sprint: sprintIndex.toString(),
      period: `${format(sprintStart)} ~ ${format(sprintEnd)}`
    }
  }
}

export const useProjectStore = create((set) => ({
    // project: null,
    // dummy data
    project: {
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
    },
    {
        name: "Bob",
        github_id: 1003,
        github_name: "bob-api",
        category: "Backend",
        role: "Developer",
        profile_img: "https://example.com/bob.png"
    },
    {
        name: "Nina",
        github_id: 1004,
        github_name: "nina-db",
        category: "Backend",
        role: "DBA",
        profile_img: "https://example.com/nina.png"
    },
    {
        name: "Clara",
        github_id: 1005,
        github_name: "clara-ai",
        category: "AI",
        role: "ML Engineer",
        profile_img: "https://example.com/clara.png"
    },
    {
        name: "Victor",
        github_id: 1006,
        github_name: "victor-ml",
        category: "AI",
        role: "Researcher",
        profile_img: "https://example.com/victor.png"
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
    },
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
    },
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
        sprint: "11",
        period: "3.18 ~ 3.22"
    }
    },
    setProject: (rawProject) => {
    const iteration = calculateIteration(rawProject.start_date, rawProject.sprint_unit)

    const categoriesObj = rawProject.members.reduce((acc, member) => {
      if (!acc[member.category]) acc[member.category] = []
      acc[member.category].push({
        image: member.profile_img,
        userName: member.name,
        githubId: member.github_name
      })
      return acc
    }, {})

    const categories = Object.entries(categoriesObj).map(([categoryName, people]) => ({
      categoryName,
      people
    }))

    set({
      project: {
        ...rawProject,
        iteration,
        categories
      }
    })
  },
  clearProject: () => set({ project: null }),
}))