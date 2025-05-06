import { useState } from 'react'
import FormTextarea from '@components/FormTextArea'
import Header from '@components/Header'
import SideBar from '@components/SideBar'

import brandIcon from '@assets/brandIcon.png'
import { MainBox } from '@styles/globalStyle'

const FormTextAreaTest = () => {
  const [value, setValue] = useState('')

  return (
    <div>
      <FormTextarea
        label='설명'
        placeholder='내용을 입력하세요'
        value={value}
        onChange={(v) => setValue(v)}
        readOnly={false}
        hideCursor={false}
        disabled={false}
        require={false}
        error={false}
      />
      <div style={{ marginTop: '1rem' }}>
        <strong>value:</strong> {value}
      </div>
    </div>
  )
}

const HeaderTest = () => {
  return (
    <div>
      <Header
        text='Header Title'
        isTab={false}
        buttonsData={[
          {
            value: 'Button 1',
            isHighlighted: false,
            onClick: () => console.log('Button 1 clicked')
          },
          {
            value: 'Button 2',
            isHighlighted: true,
            onClick: () => console.log('Button 2 clicked')
          }
        ]}
      />
    </div>
  )
}

const SidebarTest = () => {
  const mockProject = {
    projectName: 'MockProjectX',
    iteration: {
      week: '3',
      period: '2025-05-01 ~ 2025-05-07'
    },
    issues: 42,
    categories: [
      {
        categoryName: 'Frontend',
        people: [
          {
            image: brandIcon,
            userName: 'Alice',
            githubId: 'alice-dev'
          },
          {
            image: brandIcon,
            userName: 'Bob',
            githubId: 'bob-dev'
          }
        ]
      },
      {
        categoryName: 'Backend',
        people: [
          {
            image: brandIcon,
            userName: 'Charlie',
            githubId: 'charlie-dev'
          }
        ]
      }
    ]
  }

  const mockUserInfo = {
    image: brandIcon,
    userName: 'TestUser',
    githubId: 'testuser123'
  }

  const logout = () => {
    console.log('Logout clicked')
  }

  return (
    <SideBar
      brandIcon={brandIcon}
      brandTitle='CoordiPai'
      project={mockProject}
      userInfo={mockUserInfo}
      logout={logout}
    />
  )
}

const ComponentTest = () => {
  return (
    <MainBox>
      {/* <div> Component Test </div> */}
      <HeaderTest />
      <FormTextAreaTest />
    </MainBox>
  )
}

export default ComponentTest
