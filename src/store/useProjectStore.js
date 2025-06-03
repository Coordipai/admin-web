import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { differenceInDays } from 'date-fns'
import { fetchProjectDetail } from '@api/projectApi'
import { fetchIssueSummary } from '@api/issueApi'

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
    sprint: sprintIndex.toString(),
    period: `${format(sprintStart)} ~ ${format(sprintEnd)}`
  }
}

export const useProjectStore = create(
  persist(
    (set) => ({
      project: null,
      setProject: async (projectId) => {
        try {
          const [rawProject, issueSummaryData] = await Promise.all([
            fetchProjectDetail(projectId),
            fetchIssueSummary(projectId)
          ])

          const nowIteration = calculateIteration(rawProject.start_date, rawProject.sprint_unit)

          const assigneeOptions = rawProject.members.map((member) => member.github_name)

          const iterationOptions = []
          const start = new Date(rawProject.start_date)
          const end = new Date(rawProject.end_date)
          const sprintUnit = rawProject.sprint_unit

          const sprintStart = new Date(start)
          let sprintIndex = 1

          while (sprintStart <= end) {
            const sprintEnd = new Date(sprintStart)
            sprintEnd.setDate(sprintStart.getDate() + sprintUnit - 1)

            const format = (d) => `${d.getMonth() + 1}.${d.getDate()}`
            iterationOptions.push({
              title: `Iteration ${sprintIndex}`,
              period: `${format(sprintStart)} ~ ${format(sprintEnd)}`
            })

            sprintStart.setDate(sprintStart.getDate() + sprintUnit)
            sprintIndex++
          }

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

          const issueSummary = {
            openedIssues: issueSummaryData.opened_issues,
            closedIssues: issueSummaryData.closed_issues,
            allIssues: issueSummaryData.all_issues
          }

          set({
            project: {
              ...rawProject,

              // project details
              iterationOptions,
              assigneeOptions,

              // sidebar
              nowIteration,
              categories,
              issueSummary
            }
          })
        } catch (error) {
          console.error('[setProject] Failed to fetch project or issue summary:', error)
          set({ project: null })
        }
      },
      clearProject: () => set({ project: null })
    }),
    {
      name: 'project-storage'
    }
  )
)
