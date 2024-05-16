import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {userData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getUserProfile()
  }

  onClickProfileView = () => {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const profileResponse = await fetch(profileUrl, profileOptions)

    if (profileResponse.ok) {
      const profileData = await profileResponse.json()

      const updatedprofileData = {
        name: profileData.profile_details.name,
        profileImgurl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      console.log(updatedprofileData)
      this.setState({
        userData: updatedprofileData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfile = () => {
    const {userData} = this.state
    const {name, profileImgurl, shortBio} = userData
    return (
      <div className="profile-container">
        <img src={profileImgurl} alt="profile" className="profile-pic" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderProfileFailureView = () => (
    <div>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickProfileView}
      >
        Retry
      </button>
    </div>
  )

  userProfileData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfile()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return 'Failure'
    }
  }

  render() {
    return <>{this.userProfileData()}</>
  }
}

export default UserProfile
