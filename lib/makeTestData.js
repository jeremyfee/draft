var data = [
{
ID: "1",
owner: "Luke Edwards",
name: "Pot Snobs",
data: "",
id: 1
},
{
ID: "2",
owner: "Jim Carr",
name: "Shrute Bucks",
data: "",
id: 2
},
{
ID: "3",
owner: "Davin Jackson",
name: "Fungo Chickens",
data: "",
id: 3
},
{
ID: "4",
owner: "Jason McArdle",
name: "Golden Fat Chicks",
data: "",
id: 4
},
{
ID: "5",
owner: "Dave Ensminger",
name: "Phightin Philz",
data: "",
id: 5
},
{
ID: "6",
owner: "Jeff Davis",
name: "Ace Something",
data: "",
id: 6
},
{
ID: "7",
owner: "Billy Shaw",
name: "Hurtin for a Squirtin",
data: "",
id: 7
},
{
ID: "8",
owner: "Brock Anudsen",
name: "AAA Pitt",
data: "",
id: 8
},
{
ID: "9",
owner: "Timmy McArdle",
name: "Radbourn 1884",
data: "",
id: 9
},
{
ID: "10",
owner: "Joe Gross",
name: "The Bronx Bombers",
data: "",
id: 10
},
{
ID: "11",
owner: "Micah Van Sciver",
name: "The Stream Team",
data: "",
id: 11
},
{
ID: "12",
owner: "Jimmy Walsh",
name: "Chicos Bail Bonds",
data: "",
id: 12
}
];

var pickid = 1;

for (var i=0, len = data.length; i < len; i++) {
	var team = data[i];
	var picks = [];
	for (var round = 1; round <= 31; round++) {
		picks.push({
			id: pickid++,
			teamid: team.id,
			round: round,
			history: []
		});
	}

	team.data = {
		picks: picks
	};
}


console.log(JSON.stringify(data));

