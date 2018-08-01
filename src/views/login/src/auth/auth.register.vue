<template>
  <bq-page class="bq-page-login">
    <bq-header title="服务协议"></bq-header>
    <bq-content>
      <div class="serve-content">
        <h1>云采平台服务协议</h1>
        <p class="time">版本生效日期：2017年5月20日</p>
        <ul>
          <li>
            <h2>提示条款</h2>
            <p>
              云采平台为北京联合倍全电子商务有限公司旗下产品；云采产品使用者需要依据以下条件和条款享有相应的服务，请仔细阅读并遵守： 欢迎阅读北京联合倍全电子商务有限公司（云采）服务条款协议(下称“本协议”)。
            </p>
          </li>
          <li>
            <h2>接受条款</h2>
            <p>
              云采的账户是提供给能够承担相应法律责任的公司或个人。若您不具备此资格，请不要使用云采提供的服务；
            </p>
            <p>
              以任何方式进入云采官网及使用云采产品并使用服务即表示您已充分阅读、理解并同意接受本协议的条款和条件(以下合称“条款”)。
            </p>
            <p>
              云采有权根据业务需要酌情修订“条款”，并以网站公告的形式进行更新，不再单独通知予您。经修订的“条款”一经在云采官网公布，
              即产生效力。如您不 同意相关修订，请您立即停止使用“服务”。如您继续使用“服务”，则将视为您已接受经修订的“条款”，当您
              与云采发生争议时，应以最新的“条款”为准。
            </p>
            <p>
              在接受本服务条款之前，请您仔细阅读本服务条款的全部内容。如果您对本服务条款的条款有疑问的，请通过询问倍全公司，倍全公
              司将向您解释条款内 容。如果您不同意本服务条款的任意内容，或者无法准确理解倍全公司对条款的解释，请不要进行后续操作。
            </p>
          </li>
        </ul>
      </div>
    </bq-content>

  </bq-page>
</template>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-login {
    background: #FBF9F1;
    font-size: 14px;
    line-height: 16px;
    padding: 0 20px;
    box-sizing:border-box;
    .serve-content {
		padding: 0 15px;
		h1 {
      color:$font-color;
			font-size: 16px;
			padding: 20px 0;
			margin-bottom: 0;
		}
		h2 {
      text-align: left;
			font-size: 15px;
			padding: 5px 0 0 15px;
			position: relative;
      color: $font-color;
		}
		h2:before {
			content: '';
			display: inline-block;
			width: 6px;
			height: 6px;
			border-radius: 3px;
			background:#000;
			position: absolute;
			left: 5px;
			top: 17px;
		}
		p {
      text-align: left;
			font-size: 12px;
      line-height: 20px;
      color: $font-color;
			padding-bottom: 10px;
		}
		.time {
			color: #999999;
      text-align: left;
			padding-bottom: 5px;
		}
	}
  }
</style>
