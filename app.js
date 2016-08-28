var client = require('socket.io-client');
var fs = require('fs');
var raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;
var socket = client.connect('http://localhost:5000');

int straight = 75;
int curveRight = 40;
int curveLeft = 110;
var pwm = new PWM('GPIO18');

console.log('connection is established');

socket.on('emit_from_server', function(data) {
    console.log(data);
});


//�i�H�ύX���\�b�h
socket.emit('straight', pwm.write(straight));
socket.emit('righte', pwm.write(curveRight));
socket.emit('left', pwm.write(curveLeft));



//���C�g�_��
var isOn = false;   // �_�����Ă��邩�ǂ���
var count = 0;      // �_��������
var maxCount = 10;  // �_�ł������

// 8�Ԃ�GPIO�s�����o�͂Ƃ��ēo�^
fs.writeFileSync('/sys/class/gpio/export', '8');
fs.writeFileSync('/sys/class/gpio/gpio8/direction', 'out');

// 1�b���ɃI���ƃI�t��؂�ւ���
var blink = setInterval(function() {

  if(count == maxCount) {
    // GPIO�s�����J��
    fs.writeFileSync('/sys/class/gpio/unexport', '8');
    // �C���^�[�o�����I��
    clearInterval(blink);
    return;
  }

  if(isOn) {
    // LED���I�t
    fs.writeFileSync('/sys/class/gpio/gpio8/value', '0');
    isOn = false;
  } else {
    // LED���I��
    fs.writeFileSync('/sys/class/gpio/gpio8/value', '1');
    isOn = true;
    count++;
  }

}, 1000);