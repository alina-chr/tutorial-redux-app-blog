import React from 'react';
import { connect } from 'react-redux';

class UserHeader extends React.Component {
  // componentDidMount() {
  // this.props.fetchUser(this.props.userId);
  //avem o instanta de UserHeader pt fiecare post. De fiecare data cand un user header e randat, componentDidMount e chemat.
  //deci pt ca randam 100 instante UserHeader, actioncreator e chemat de 100 ori desi noi chemam data pt doar 10 useri
  // }

  render() {
    // const user = this.props.users.find((user) => user.id === this.props.userId);
    // acum am acces la this.props.user
    const { user } = this.props;
    if (!user) {
      return null;
    }
    return <div className="header">{user.name}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  //ownProps este o referinta la props care vor intra in componenta
  return {
    user: state.users.find((user) => user.id === ownProps.userId),
  };
};

// export default connect(mapStateToProps, { fetchUser })(UserHeader);
export default connect(mapStateToProps)(UserHeader);
