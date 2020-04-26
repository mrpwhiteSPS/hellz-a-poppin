const  ActionHandlers = {
    GetGame: (data) => {
      console.log("Unhandled Webhook Message GetGame", data)
    },
    ClaimedPosition: (data) => {
      console.log("Unhandled Webhook Message ClaimedPosition", data)
    }
  }

export {ActionHandlers}