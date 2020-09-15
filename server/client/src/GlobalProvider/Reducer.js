
export default (state, action) => {
    
    switch (action.type) {
        case 'Add_user':
            return {
                ...state,
                user: action.payload

            }
            case 'clear_user':
                return {
                    ...state,
                    user: ""
                }
    
        default:
            return state
    }

}