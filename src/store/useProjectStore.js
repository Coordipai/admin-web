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
    project: null,
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