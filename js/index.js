const gameBoxContainer = document.querySelector("div.game-box")
const currentPlayerContainer = document.querySelector("div.current-player")
const endGameContainer = document.querySelector("div.end-game")
const newGameContainer = document.querySelector("button.new-game")

const getButtons = () => Array.from( document.querySelectorAll("div.game-box > button") )

const getDataPlayers = () =>
	getButtons()
	.map( button => button.children[0] ? button.children[0].dataset.player : null)

const combinations =
[
	[0, 1, 2],
	[0, 4, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 4, 6],
	[2, 5, 8],
	[3, 4, 5],
	[6, 7, 8]
]

const players =
{
	x: "x",
	o: "o",

	currentPlayer: "x"
}

const state =
{
	gameOver: false,

	setPlayer: () => {
		const current = players.currentPlayer === "x" ? "o" : "x"
		players.currentPlayer = current
	}
}

const generateImage = player =>
{
	const img = document.createElement("img")

	img.setAttribute("src", `img/${player}.png`)
	img.setAttribute("data-player", player)

	return img
}

const showAndHiddenNewGameButton = display => newGameContainer.style.display = display

const showAndHiddenCurrentPlayer = display => currentPlayerContainer.style.display = display

const highlight = buttons => buttons
	.forEach( button => button.style.backgroundColor = "#7EFFA2" )

const endGame = ( indexValues, player ) =>
{
	state.gameOver = true

	if ( indexValues )
	{
		const buttons = getButtons()
		const buttonsChampions =
		[
			buttons[ indexValues[0] ],
			buttons[ indexValues[1] ],
			buttons[ indexValues[2] ]
		]

		highlight( buttonsChampions )
	}

	endGameContainer.textContent = `" ${ player.toUpperCase() } " ganhou esta partida.`

	showAndHiddenNewGameButton( "flex" )
	showAndHiddenCurrentPlayer( "none" )
}

const hasWinner = () =>
{
	const dataPlayers = getDataPlayers()
	const gameBoxContainerComplete = !dataPlayers.some( dataPlayer => dataPlayer === null )

	for ( let row = 0 ; row < 8 ; row++ )
	{
		const indexValues = [ combinations[row][0], combinations[row][1], combinations[row][2] ]

		const dataPlayersAreEquals =
			   dataPlayers[ indexValues[0] ] === dataPlayers[ indexValues[1] ]
			&& dataPlayers[ indexValues[1] ] === dataPlayers[ indexValues[2] ]
			&& dataPlayers[ indexValues[0] ] !== null

		dataPlayersAreEquals
			? endGame( indexValues, dataPlayers[ indexValues[0] ] )
			: gameBoxContainerComplete ? endGame( "", "ninguém" ) : false
	}
}

const showPlayerInButtonContainer = (buttonElement, player) =>
{
	buttonElement.appendChild( generateImage( player ) )
	hasWinner()
	state.setPlayer()
}

const showCurrentPlayer = player =>
{	
	const currentPlayerImg = document.querySelector("div.current-player img")

	players.currentPlayer === players.x
		? currentPlayerImg.setAttribute("src", "img/x.png")
		: currentPlayerImg.setAttribute("src", "img/o.png")
}

const handleBoxContainer = ({target}) =>
{

	const buttonWasClicked = target.tagName === "BUTTON"

	if ( !buttonWasClicked ) { return }

	const buttonIsEmpty = target.getElementsByTagName("img").length === 0

	if ( buttonIsEmpty && !state.gameOver)
	{
		players.currentPlayer == players.x
			? showPlayerInButtonContainer( target, players.x )
			: showPlayerInButtonContainer( target, players.o )
	}

	showCurrentPlayer();

}

const clearGameBoxContainer = () =>
	Array.from(gameBoxContainer.children)
		.forEach( button => {
			button.style.backgroundColor = "#C4C4C4"

			const image = Array.from( button.children )[0]

			if ( image ) { image.remove() }
		})

const handleGameContainer = () =>
{
	state.gameOver = false
	players.currentPlayer = "x"

	showAndHiddenNewGameButton( "none" )
	showAndHiddenCurrentPlayer( "flex" )

	clearGameBoxContainer()

	document.querySelector("div.current-player img")
		.setAttribute("src", "img/x.png")

	endGameContainer.textContent = ""
}


showCurrentPlayer()

gameBoxContainer.addEventListener( "click", handleBoxContainer )
newGameContainer.addEventListener( "click", handleGameContainer )