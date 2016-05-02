(function(angular, $) {
  'use strict';

  angular
    .module('itcast-tms.areas')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/watcher/:stamp', {
        controller: 'WatcherController',
        templateUrl: 'view/watcher.html'
      })
    }])
    .controller('WatcherController', [
      '$scope',
      '$rootScope',
      '$location',
      '$routeParams',
      WatcherController
    ]);

  function WatcherController($scope, $rootScope, $location, $routeParams) {

    // 获取当前打开记录的stamp
    const stamp = $routeParams.stamp;

    // model
    $scope.model = {};
    $scope.action = {};

    // 获取记录文件内容
    $scope.data = $.storage.get(stamp);

    // TODO: 没有文件情况
    if (!$scope.data) {
      alert('没有对应的测评信息！');
      $location.url('/starter');
      return false;
    }

    // 全局记录当前打开记录stamp
    $rootScope.current_stamp = stamp;
    // $rootScope.$watch('current_stamp', now => now == stamp || $location.url('/starter'));

    // 监视测评人数
    $.storage.watch(stamp, data => {
      // $scope.data.rated_count = data.rated_count;
      $scope.data = data;
      $scope.$apply();
    });

    // 添加新邮箱
    $scope.model.email_input = '';
    $scope.action.add_email = () => {
      if (!$scope.model.email_input) return false;
      $scope.model.email_input.includes('@') || ($scope.model.email_input += '@itcast.cn');
      $scope.data.added_emails.push({ name: '手动添加', title: '系统', email: $scope.model.email_input });
      $scope.model.email_input = '';
      save();
    };

    // 删除邮箱
    $scope.action.del_email = (item) => {
      $scope.data.added_emails.splice($scope.data.added_emails.indexOf(this), 1);
      // $scope.data.added_emails.remove(item);
      save();
    };
    // ===== ======= =====

    // 复制链接
    $scope.action.copy = txt => {
      $.electron.clipboard.writeText(txt);
      alert('已经将打分链接复制到剪切板\n请将链接发送给学生');
    };

    // 开始评测按钮
    $scope.action.start = () => {
      // 当前状态为初始状态
      if ($scope.data.status === $.options.status_keys.initial) {
        // 开始测评
        $scope.data.status = $.options.status_keys.rating;
        save();
      }
    };

    // 结束评测按钮
    $scope.action.stop = () => {
      $scope.data.rated_count = Object.keys($scope.data.rated_info).length;
      if (!$scope.data.rated_count) {
        alert('尚未有人提交测评表单！');
        return false;
      }
      if (!(confirm('确定结束吗？') && confirm('真的确定结束吗？'))) return false;
      // 当前状态为正在测评
      if ($scope.data.status === $.options.status_keys.rating) {
        // 测评完成状态
        $scope.data.status = $.options.status_keys.rated;
        save();
        // 计算报告
        // $.report($scope.data);
        // Object.assign($scope.data, $.report($scope.data));
        // save();
      }
    };

    // 发送邮件按钮
    $scope.action.send = () => {
      console.log($scope.data);
      if (!(confirm('确定发送邮件吗？')))
        return false;
      if ($scope.data.status === $.options.status_keys.rated) {
        $scope.data.status = $.options.status_keys.sending;
        save();
        // 发送邮件
        $.mail($scope.data)
          .then(message => {
            $.logger.debug(message);
            $scope.data.status = $.options.status_keys.send;
            save();
            alert('邮件发送成功\n' + JSON.stringify(message));
          })
          .catch(error => {
            $.logger.error(error);
            alert('邮件发送失败\n请将renderer.log发送到wanglei3@itcast.cn');
          });
      }
    };

    function save() {
      $.storage.set(stamp, $scope.data);
    }

  }
}(angular, $));