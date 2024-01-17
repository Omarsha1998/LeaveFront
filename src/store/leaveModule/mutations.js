export default {
  SET_LEAVE_DATA(state, data) {
    state.leaveData = data;
  },

  SET_LEAVE_DETAILS(state, leaveDetails) {
    state.leaveDetails = leaveDetails;
  },

  SET_UPDATE_LEAVE(state, updatedLeave) {
    const leaveIndex = state.leaveDetails.findIndex(leave => leave.id === updatedLeave.id);
    if (leaveIndex !== -1) {
      state.leaveDetails[leaveIndex] = updatedLeave;
    }
  },

  SET_PENDING_DETAILS(state, pendingDetails) {
    state.pendingDetails = pendingDetails;
  },

  SET_BALANCE_DETAILS(state, balanceDetails) {
    state.balanceDetails = balanceDetails;
  },

  CLEAR_LEAVE_DETAILS(state) {
    state.leaveDetails = null;
  },
  
  setBase64Image(state, base64Image) {
    state.base64Image = base64Image;
  },

  SET_APPROVED_DETAILS(state, approvedDetails) {
    state.approvedDetails = approvedDetails;
  },

  SET_REJECTED_DETAILS(state, rejectedDetails) {
    state.rejectedDetails = rejectedDetails;
  },

  SET_BALANCE_ALLBALANCE(state, AllBalanceDetails) {
    state.AllBalanceDetails = AllBalanceDetails;
  },

  SET_FORFEITED_DETAILS(state, ForfeitedDetails) {
    state.ForfeitedDetails = ForfeitedDetails;
  },

  INCREMENT_403_ERRORS(state,) {
    state.numberOf403Errors++;
  },

  RESET_403_ERRORS(state) {
    state.numberOf403Errors = 0;
  },
}