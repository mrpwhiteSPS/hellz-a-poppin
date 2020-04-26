Tasks
- start server
- provide 200
- connect to mongo
- create a game in monog



Features
# Create a game


# Share a game


# Add players to the game


# Deal the cards
https://www.npmjs.com/package/shuffle

# Track Score


Data Model

Game{
	seats: [Seat]
	rounds: [Round]

	//Computed values
	scoreboard: 
}

Round { 
	number
	startingHands: [Hand]
	dealer: Seat // Maybe computed
	bids: [Bid]
	Tricks: [Trick]
	
	// These should be computed properties
	currLeadSuit: Suit
	currLeader: Seat
	currHand: [Hand]
	currTrick: [{
		Player_id,
		Card
	}]
}

Bid {
	player_id
	position
	bid
}

Trick {
	[Card]
	
	// Computed
	winner: player_id
}

Player {
	Name
	Position
}

Turn {
	Number
}