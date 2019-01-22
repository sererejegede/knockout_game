const socket = io.connect('http://localhost:4111');


// window.onload = () => {
  var app = new Vue({
    el: '#app',
    data: {
      dice: {
        one: 1,
        two: 2,
        total: 0,
        double: false
      },
      player1: {
        curr: 0,
        prev: 0,
        single_score: 0,
        playing: true,
        name: 'Player One'
      },
      player2: {
        curr: 0,
        prev: 0,
        single_score: 0,
        playing: false,
        name: 'Player Two'
      },
      prefix: 'assets/Dice/dice',
      ext: '.png',
      forbidden_numbers: {
        curr: [],
        prev: []
      },
      aux_message: '',
      aux_message2: '',
      loading: false,
      score_to_reach: 2,
      num_of_players: 2,
      room_code: '',
      generated_room_code: '',
      game_over: false,
      start_date: '2008-12-26',
      end_date: '2018-12-27',
      game_joined: false,
      creating_game: false,
      code_generated: false,
      joining_game: false
    },
    methods: {
      createRoom() {
        let code = '';
        for (let i = 0; i < 4; i++) {
          code += this.generateNumber(10);
        }
        this.generated_room_code = code;
        socket.emit('create', {
          code: this.generated_room_code,
          num_of_players: this.num_of_players
        });
      },
      joinRoom(room_code) {
        socket.emit('join', {
          code: room_code,
        });
        socket.on('joined', () => this.game_joined = true);
      },
      generateNumber(rand = 7) {
        let num = Math.floor(Math.random() * Math.floor(rand));
        while (num === 0) {
          num = this.generateNumber();
        }
        return num;
      },
      computeDieThrow(number_of_dice = 2) {
        const outputArray = [];
        if (number_of_dice > 1) {
          while (number_of_dice > 0) {
            let num = this.generateNumber();
            outputArray.push(num);
            --number_of_dice;
          }
        } else {
          outputArray.push(generateNumber());
        }
        this.dice.one = outputArray[0];
        this.dice.two = outputArray[1];
        this.dice.double = (this.dice.one === this.dice.two);
        this.dice.total = this.dice.one + this.dice.two;
        this.whoIsPlaying();
      },
      whoIsPlaying() {
        if (this.player1.playing) {
          this.aux_message2 = 'Player One rolled a ' + this.dice.total;
          this.player1.prev = this.player1.curr;
          if (this.forbidden_numbers.curr.includes(this.dice.total)) {
            this.aux_message = 'You have rolled a forbidden number. You miss this turn';
            this.player1.playing = false;
            return this.player2.playing = true;
          } else {
            this.aux_message = '';
            this.player1.curr += this.dice.total;
            this.player1.playing = false;
            this.player2.playing = true;
            setTimeout(() => this.isThereAWinner(this.player1), 100);
            return
          }
        }
        if (this.player2.playing) {
          this.aux_message2 = 'Player Two rolled a ' + this.dice.total;
          this.player2.prev = this.player2.curr;
          if (this.forbidden_numbers.curr.includes(this.dice.total)) {
            this.aux_message = 'You have rolled a forbidden number. You miss this turn';
            this.player2.playing = false;
            this.player1.playing = true;
          } else {
            this.aux_message = '';
            this.player2.curr += this.dice.total;
            this.player2.playing = false;
            this.player1.playing = true;
            setTimeout(() => this.isThereAWinner(this.player2), 100);
          }
          return this.refreshForbiddenNumbers();
        }
      },
      isThereAWinner(player) {
        if (player.curr >= this.score_to_reach) {
          this.game_over = true;
          alert(`Game over. ${player.name} wins!`);
          return true;
        } else return false;
      },
      refreshForbiddenNumbers() {
        this.loading = true;
        setTimeout(() => {
          this.forbidden_numbers.prev = this.forbidden_numbers.curr;
          this.forbidden_numbers.curr = [];
          for (let i = 3; i > 0; i--) {
            this.forbidden_numbers.curr.push(this.generateNumber(13));
          }
          this.loading = false;
        }, 1000);
      },
      dateDifference() {
        console.log(
          (new Date(this.end_date).getTime() - new Date(this.start_date).getTime()) / (86400000)
        )
      }
    },
    mounted() {
      this.forbidden_numbers.curr = this.refreshForbiddenNumbers();
    }
  });
// }