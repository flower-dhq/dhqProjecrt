<style lang="scss" scoped>
.privacy {
  padding: 20rpx 38rpx 40rpx 38rpx;
  box-sizing: border-box;
  font-family: PingFang SC;
  ::v-deep p {
    line-height: 24px;
  }
}
.first {
  font-size: 40rpx;
  font-weight: 700;
  /* line-height: 45rpx; */
  text-align: center;
  line-height: 100rpx;
}
.pre {
  font-size: 28rpx;
  line-height: 45rpx;
  word-wrap: break-word;
  word-break: break-all;
}
.MsoNormal {
  font-size: 28rpx;
  line-height: 45rpx;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
<template>
  <view class="privacy" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view v-html="userAgreement"></view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userAgreement: `<p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
	    <span>本应用软件是为员工提供的</span><span>“移动化”工作管理平台 (下称“本平台”)。</span> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>用户务必仔细阅读、充分理解《用户服务协议》</span>(下称“本协议”)的内容。本协议是您与本平台的所有者和运营方之间就本平台服务等相关事宜所订立的契约。特别是以加粗或下划线形式提示您注意的关于免除或者限制责任的条款、法律适用和争议解决条款。如您对协议有任何疑问，可向本平台客服咨询。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您有权选择同意或不同意本协议。当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即视为您已充分阅读、理解并接受本协议的全部内容，并与本平台达成一致，成为本平台的</span><span>“用户”。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序并停止使用本平台服务。</span> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            请您在决定注册或使用本平台服务前再次确认您已知悉并完全理解本协议的所有内容。未成年人应在法定监护人陪同下阅读。<b>一旦您下载、安装或使用本软件及其相关服务，即表示您同意无条件接受本协议所有条款和条件的约束。</b>本协议的修改与解释权归本平台所有。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本协议自您接受之日起生效，在您使用本平台的过程中持续有效，直至依据本协议终止。如果您使用本平台的时间早于您接受本协议的时间，您在此知晓并同意本协议于您第一次使用本平台时生效，本平台与您之间的权利义务以本协议约定内容为准，除非依据本协议提前终止。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            用户应当随时关注本协议条款的修改，并决定是否继续使用本平台提供的各项服务。用户的下载、安装、使用、账号获取和登录等行为将视为对当时的服务条款及隐私协议的同意和承诺遵守。如用户不同意本服务条款的任意内容，请勿注册或使用本软件及其相关服务，并应立即停止注册程序。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>如用户对本服务协议的内容</span>(特别是涉及免除或者责任限制的条款)有任何疑义，可随时按照本服务协议中列明的联系方式与我们联系，本平台将根据用户的要求为用户进一步解释和说明相关内容。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台保留因业务发展需要，单方面对本服务的全部或者部分服务内容在事先通知的情况下变更、暂停、限制、终止或撤销本平台服务的权力，用户需承担此风险。
        </p>
        <h3 style="margin-left:0.0000pt;text-indent:0.0000pt;">
            <b>[协议的范围]</b><b></b> 
        </h3>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1. 本协议为用户与本平台就其所提供的服务所订立的协议。“用户”是指使用本平台相关服务的使用人。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2. 本协议项下的服务是指本平台向用户提供的包括但不限于本协议第5条所列示的相关产品及服务。本平台有权就其提供的服务或销售的产品向用户收取费用。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3. 本平台所有的产品/服务(包括本平台提供的产品/服务及未设独立《用户服务协议》的本平台关联方提供的产品/服务)均适用本协议。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            4. 本平台的产品/服务是指本平台网络及技术服务提供者通过下述途径向您提供的产品/服务。
        </p>
        <h3 style="margin-left:0.0000pt;text-indent:0.0000pt;">
            <b>[知识产权声明]</b><b></b> 
        </h3>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1. 本平台的一切版权、商标权、专利权、商业秘密等知识产权，以及与软件相关的所有信息内容，包括但不限于:文字表述及其组合、图标、图饰、图表、色彩、界面设计、版面框架、有关数据、印刷材料或电子文档等均受中华人民共和国著作权法、商标法、专利法、反不正当竞争法和相应的国际条约以及其他知识产权法律法规的保护，除涉及第三方授权的软件或技术外，本平台享有上述知识产权。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2. 本平台所拥有的上述权利及所提供服务中所包含的任何内容的知识产权均受到法律保护，未经本平台书面同意，用户不得且不应允许或协助任何人以任何形式(包括但不限于通过任何机器人、蜘蛛、截屏等程序或设备)进行使用、出租、出借、分发、展示、复制、修改、链接、转载、汇编、发表、出版、抓取、监视、引用或创造相关衍生作品。本平台保留追究上述未经许可行为的权利。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3. 第三方软件和技术
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1) 本软件可能会使用第三方软件或技术(包括本软件可能使用的开源代码和公共领域代码等，下同)，这种使用已经获得合法授权。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2) 本软件如果使用了第三方的软件或技术，本平台将按照相关法规或约定，对相关的协议或其他文件，可能通过本协议附件、在本软件安装包特定文件夹中打包等形式进行展示，它们可能会以“软件使用许可协议”、“授权协议”、“开源代码许可证”或其他形式来表达。前述通过各种形式展现的相关协议或其他文件，均是本协议不可分割的组成部分，与本协议具有同等的法律效力，用户应当遵守这些要求。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3) 本软件所使用的第三方软件或技术可能将收集、处理和使用您的个人信息或数据以实现相关服务的提供(包括但不限于由第三方提供的相关远程门禁开锁服务、停车缴费服务等)，本平台将通过与该等第三方签署相关协议要求其按照通常商业惯例对用户个人信息予以严格保密。如因本软件使用的第三方软件或技术引发的包括个人信息或隐私侵权等任何纠纷，应由该第三方负责解决，本平台不承担任何责任。本平台不对第三方软件或技术提供客服支持，若用户需要获取支持，请与第三方联系。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            4. 在使用本平台相关客户端的过程中，用户可能需要下载特定软件。为了改善用户体验、修复漏洞、保障安全性等考虑，本平台有权对软件进行更新，用户应该将相关软件更新至最新版本，否则本平台将不保证用户能正常使用相关软件。如果用户从未经本平台授权的第三方获取软件或与该软件名称相同的安装程序，本平台无法保证该软件能够正常使用，由此造成的相关损失，本平台不予负责。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5. 除非本平台书面认可，用户在使用本平台的软件时不得从事下列任一行为:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1) 删除、编辑或遮挡软件及其副本上关于著作权、商标或其他权利标识或标记的信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2) 复制、发布、出售或出租软件或其任何部分;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3) 对软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试挖掘、提取软件的源代码;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4) 其他对软件、软件所产生的数据所进行的任何增加、删减、变动的任何行为，包含制作、利用、授权各种第三方外挂、插件、系统进行上述行为;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (5) 其他可能导致软件著作权受到侵害的行为;
        </p>
        <h3 style="margin-left:0.0000pt;text-indent:0.0000pt;">
            <b>[服务条款]</b><b></b> 
        </h3>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.关于账户
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.1注册资料
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您必须注册并且于注册页面上提供相关的个人信息。在注册账户提交资料时，您应遵循诚实信用、合法善意的原则，向本平台提交相关注册资料。您必须承诺和保证</span>:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1) 您使用本平台的行为必须合法；
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2) 您保证在遵守法律法规和确保安全的前提下使用本软件；
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3) 您提交的所有注册信息必须真实准确，相关资料如有变动，您应及时更新；
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4) 相关注册资料应当遵守法律法规、政策、社会主义制度、国家利益、公民合法权益、公序良俗、信息真实等原则，不应提交任何违法或不良信息。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2 账户使用
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2.1 账号登录
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您可以使用注册账号时填写登记的手机号码登录本平台。为了您的使用便利，本平台可根据相关法律法规、监管要求、用户体验、风险控制等因素对登录方式予以适时调整或增减，或在具体业务门类的用户服务条款等规定中予以进一步细化或调整。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2.2 账号使用
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您应对您账号项下的所有行为</span>(包括但不限于在线签署任何协议，考勤打卡、处理工单、品质巡检、任务审批、等任何内容)所产生的一切后果负责，通过您的账号所发生的上述各项行为将视为您本人的真实意思表示。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台提示您，您通过自身账号在接受本平台的各项服务中所上传、发送的任何内容都应真实、客观、合法，具有合法来源，不得侵犯任何第三方的合法权益。如本平台收到涉及您的相关举报或投诉，本平台可采取相关法律法规所要求或允许的方式，向相关争议方、相关部门提供包括账号在内的必要的信息，以便解决纠纷争议，保护正当权利人的合法权益。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2.3 账号借用
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>为保证相关账号安全，未经本平台的书面同意，您不应将</span><span>“本平台”平台上所注册的账号借给他人使用，否则您应当承担由此产生的全部责任，“本平台”平台保留拒绝提供相应服务、冻结或收回注册账号或终止本服务协议的权利，并可要求您对本平台所承受的损失予以赔偿。</span> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2.4 安全义务
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            如您发现账号存在安全问题，请您立即联系本平台予以调查处理，否则本平台对潜在损失的产生或扩大不承担任何责任。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台特别提示您，您应该妥善保管您的账号和密码，当您使用完毕本平台的服务后，您应安全退出。此外，您不应轻信借款、索要密码或其他涉及财产的网络信息。涉及财产操作的，请一定先核实对方身份，并请经常留意本平台有关防范诈骗犯罪的提示。您知悉并同意，如您在账号信息的保管上、相关上网设备的网络安全维护上存在任何过失导致账号丢失、泄露、被盗用，您应对此所产生的任何后果负责，本平台对此不负任何责任，如本平台因此产生相关支出，本平台将有权向您予以追偿。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.2.5 限制冻结
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您知悉并同意，在符合法律法规的规定，或经国家机关要求、或您使用账户过程中存在其他严重违反平台规则、扰乱平台秩序情形的前提下，本平台有权对您的注册账号进行限制或冻结，在该等情况下，您可能无法继续登陆或使用您的注册账号。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.3 账户终止
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您可以按照本平台的说明随时终止使用您的账户。本平台将会依据本协议第</span>6条的规定保留或终止您的账户。您必须承诺对您的登录信息保密、不被其他人获取并使用并且对您在本平台账户下的所有行为负责。您必须将任何有可能触犯法律的，未授权使用或怀疑为未授权使用的行为在第一时间通知我们。本平台不对您因未能遵守上述要求而造成的损失承担法律责任。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.4民事行为能力
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您知悉并承诺，您具有完全民事权利能力和行为能力或虽不具有完全民事权利能力和行为能力但已经过您的家长和其他法定监护人同意并由您的家长和其他法定监护人代理注册及使用本平台的各项服务。若您不具备前述相适应的民事行为能力即进行账号注册的，则您及您的家长和其他法定监护人应依照法律规定承担因此而导致的一切后果。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.5真实身份
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>因国家法律法规、监管要求及特定门类的服务</span>(如金融服务等)需要，您有可能需要在注册或使用该等服务的特定环节中填写真实的身份信息，并需通过相关验证流程后方可使用服务，如您填写的身份信息不完整、不真实或未通过验证，将导致您无法使用该服务、损害自身、他人利益或造成其他不利后果，该等后果将由您予以承担。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.6注册信息保护
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本平台将对您所提交的注册信息予以保护，不会将其披露给任何非关联的第三方，除非</span>:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)相关法律法规或国家机关要求;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)本平台发生相关合并、分立、收购或资产转移;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)或为提供相关服务所必须的。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            对于您所提交的注册信息中涉及个人信息的内容，本平台将严格按照《隐私政策》的规定进行收集、处理和使用。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            1.7 账号数量
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            除因历史原因、业务整合等本平台所认可的特殊情况外，本平台原则上只允许您使用一个用户账号。如有证据证明或本平台有理由相信您存在不当注册或不当使用多个本平台账号的情形，本平台可将相关账号信息进行合并或采取其他合理措施，如因您不当注册或不当使用给本平台及相关方造成损失的，您还应承担相应的赔偿责任。此外，出于相关业务需要，本平台也可对同一用户的多个账号或相关信息进行合并，如该等合并将对您的权益产生实质影响，本平台将在进行上述合并前事先征得您的同意。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>如果因您所提供的注册资料不合法、不真实、不准确或未及时更新，从而导致相关法律责任或不利后果的，您将承担相应的法律责任及不利后果，且我们保留终止用户使用本平台各项服务的权利。</b>您已知悉，在本平台账号注册过程中，因安全性、内部管理等原因，部分初始注册资料可能将无法再次更改。因此，您应谨慎核查此部分注册资料，确保正确填写。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2. 终端用户协议
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.1 许可
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.1.1 依据本协议规定，本平台将授予您以下不可转让的、非排他的许可:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1) 使用本软件的权利;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2) 在您所有的移动通信设备上下载、安装、使用本平台的权利。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.1.2 本条及本协议其他条款未明示授权的其他一切权利仍由本平台保留，您在行使这些权利时须另外取得本平台的书面许可。本平台如果未行使前述任何权利，并不构成对该权利的放弃。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.2 限制性条款
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本协议对您的授权将受到以下限制</span>:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)您不得对本平台进行任何形式的许可、出售、租赁、转让、发行或做其他商业用途;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)除非法律禁止此类限制，否则您不得对本平台的任何部分或衍生产品进行修改、翻译、改编、合并、利用、分解或反向编译等;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)您不得以创建相同或竞争服务为目的使用本平台;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4)除非法律明文规定，否则您不得对本平台的任何部分以任何形式或方法进行复制、发行、再版、下载、显示或张贴等;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (5)您不得删除或破坏包含在本平台中的任何版权声明或其他所有权标记。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.3权利归属
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本平台运营方许可您下载和使用本平台</span>;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本平台运营方</span>(及其“授权人”，如有)拥有本平台的包括相关的知识产权在内的所有权利、所有权和利益，但不包括您的用户内容。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.4费用
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您必须自行准备上网设备，包括并不限于手机、平板、电脑或者其他上网终端。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您必须自行负担个人上网或第三方</span>(包括但不限于电信或移动通讯提供商)收取的通讯费、信息费等相关费用。如涉及电信增值服务，我们建议您与增值服务提供商确认相关费用问题。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            2.5任何本平台的未来版本、更新或者其他变更将受到本协议或本协议修订版本的约束。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3.关于用户
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3.1用户内容
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>用户内容是指该用户下载、发布或以其他方式使用本平台时产生的所有内容</span>(例如:您的信息、文字、图片、音频、视频或其他内容)。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您是您的用户内容唯一的责任人，您将承担因您的用户内容披露而导致的您或任何第三方被识别的风险。您已同意您的用户内容受到第</span>4条的限制。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3.2许可
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>您通过上传、发行或其他方式使用本平台的用户内容时，即视为您主动将上述内容的非专属、可转让的财产性权利，如著作权</span>(包括但不限于:复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利)，在全世界范围内永久、免费、独家且不可撤销地授权给本平台，本平台可基于该等授权使用上述内容(包括但不限于用于商业用途)或向第三方自主进行任何必要的转授权。该等授权、转授权的使用场景包括但不限于:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)仅为向您提供本平台服务或改进本平台之目的，复制、发行、公开展示和表演、制作衍生作品、将其纳入其他作品或以其他方式使用您的用户账户(排除您的个人信息);并授予上述事项的转让许可;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)仅为向目标接收者提供个人信息之目的，复制、发行您的用户内容中的私人信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)您同意不可撤销的、放弃(并会导致被放弃)关于您用户内容的道德权利和归属的声明;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(4)您知悉、理解并同意，用户一旦接受本服务协议，当前或其他任何网站、应用程序、产品或移动终端设备等，且本平台或本平台所授权许可的第三方可通过对上述授权内容进行修改、复制、改编、翻译、汇编或制作，形成衍生产品。在不违反相关法律法规的强制性规定、尊重相关原始授权内容的知识产权的基础上，该等衍生产品的相关知识产权归本平台或本平台所授权许可的第三方所有;</b>&gt;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (5)您确认并同意授权本平台以自己的名义或委托专业第三方针对有关用户上传、提交、存储或发布的内容(含衍生作品)的侵权行为进行独立自主的维权并获得全部赔偿。维权形式包括但不限于:监测侵权行为、发送维权函、提起诉讼或仲裁、调解、和解等。本平台有权对维权事宜做出独立决策并予以实施;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(6)您理解并同意，您在使用本软件及其相关服务时上传、提交、存储或发布的内容(包括但不限于文字、图片、视频、音频、动画等)均由您原创或已获合法授权。您的上传、提交、存储或发布行为不会侵犯他人的知识产权，否则由此导致的全部责任由您承担。如本平台，或本平台授权的其他服务提供方因第三方知识产权维权而产生损失，用户将等额赔偿;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (7)本服务协议已经构成《著作权法》第二十五条所规定的书面协议，其效力及于用户在本平台发布的任何受著作权法保护的作品内容，无论该内容形成于本服务协议签订前还是本服务协议签订后。本平台转授权、许可的相关方有权将用户在本平台发表的服务体验、服务讨论或图片进行使用或者与其他人合作使用，使用范围包括但不限于网站、电子杂志、杂志、刊物、海报、公众号文章、微信小程序等;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (8)您对本平台提出的建议(或称“反馈”)，即视为您向本平台运营方转让“反馈”的全部权利并同意本平台运营方有权利以合法、必要、合理方式使用此反馈及其相关信息。我们将视此类反馈信息为非保密且非专有;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (9)您已同意您不会向本平台运营方提供任何您视为保密和专有的信息。否则由此导致的后果由您承担。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            3.3我们将保留基于我们的判断检查用户内容的权利(而非义务)。无论通知与否，我们有权在任何时间以任何理由删除和移动您的用户内容。依据第6条规定，我们有权保留或终止您的账户。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            4.权利限制
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>4.1在使用本平台中，您将承担因下述行为所造成的风险及产生的全部法律责任:</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(1)破坏宪法所确定的基本原则的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(2)危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(3)损害国家荣誉和利益的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(4)煽动民族仇恨、民族歧视，破坏民族团结的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(5)破坏国家宗教政策，宣扬邪教和封建迷信的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(6)散布谣言，扰乱社会秩序，破坏社会稳定的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(7)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(8)侮辱或者诽谤他人，侵害他人合法权益的;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(9)含有法律、行政法规、政策或平台规则所禁止的其他内容的。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            4.2您已同意不在本平台从事下列行为，否则您将承担因下述行为所造成全部风险及产生的全部法律责任:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(1)上传或发布电脑病毒、蠕虫、恶意代码、故意破坏或改变计算机系统或数据的软件;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(2)未授权的情况下，收集其他用户的信息或数据，包括但不限于电子邮箱地址等;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(3)禁用本平台的网络连接，给本平台造成过度的负担或以其他方式干扰或损害网站服务器和网络链接;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(4)在未授权的情况下，尝试访问本平台或服务器;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(5)自行或授权、协助任何第三方非法抓取本平台所展示的任何内容(“非法抓取”是指采用未经本平台认可的程序或者非正常浏览等技术手段获取内容数据的行为);</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(6)利用本平台或相关服务从事违反国家法律法规禁止性规定的行为;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(7)因对本平台相关服务的使用行为导致本平台卷入政治和公共事件;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(8)入侵本平台计算机信息系统，或从事危害计算机信息网络安全的活动;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(9)盗取他人账户、银行账号等信息或盗取他人账户中的资产等;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(10)利用小程序、技术手段、拆单或其他方式，为套取优惠、折扣、赠品、运费或其他利益而注册一个或多个账户、一人使用同一或多个账户，或合意他人使用同一或多个账户进行下单;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(11)一人或多人合意使用一个或多个账户实施不当行为，包括但不限于:购买商品或服务等数量超过正常生活消费需求，下单不支付、不完全支付或者选择延迟发货等方式违规占库存等;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(12)通过订单收货信息、订单备注、留言、评价等手段发送违规内容、广告或垃圾信息;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(13)虚假好评或以“刷单”等不正当方式帮助他人提升评价;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(14)滥用购买商品或服务、评价、申请退款、申请售后服务、发起投诉或索赔等权利，损害他人合法权益或妨害平台运营秩序，如:虚假下单、恶意代下单、刷单、恶意取消订单，发布无根据的恶意评价，多次恶意进行负面评价，利用评价权利对其他用户、商户实施威胁、敲诈勒索，利用本平台、本平台入驻商家的过错或失误进行恶意索赔、恶意投诉，或者无故对平台、商家或客服人员进行辱骂、人身攻击;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(15)通过侵犯第三人合法权益、作弊、扰乱系统、实施网络攻击、恶意套现、刷信誉、批量注册、用机器注册本平台账户、用机器模拟客户端、利用系统故障或漏洞等手段谋取利益、进行交易或参加本平台或其所授权的第三方发布的任何活动(如：领取/兑换优惠券，进行抽奖，参与各类优惠活动等);</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(16)未经本平台同意，利用注册的账户进行牟利性经营活动(如批发、炒货、转卖等);</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(17)非因商品或服务质量原因，短期内多次拒收商品或拒绝接受服务;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(18)购买正品商品，退货时退回非本平台对应订单中销售的商品、以次充好、以假乱真等行为;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(19)商品或服务的供应商、代理商、销售商对其所供货或销售的商品、服务进行回购;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(20)其他任何将本平台以任何形式作为从事各种非法活动的场所、平台或媒介的行为以及影响用户客观评论、干扰本平台正常运转或正常交易秩序、违反公平或诚实信用原则的行为。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.本平台服务及规范
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.1本平台提供的服务内容
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本平台提供的服务包括</span>(视用户选择的不同情况而定):
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)工单管：包括对工单的新增、转派、处理、评价、作废、重启等;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)品质巡检：对所服务项目的巡检点位进行检查;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)住户审批：对所服务的网格客户进行住户认证审批;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4)本平台根据实际业务开展需要向注册用户提供的其他服务。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.2责任限制
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.2.1不可抗力及第三方原因
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台依照法律规定履行基础保障义务，但对于下述原因导致的合同履行障碍、履行瑕疵、履行延后或履行内容变更等情形，本平台并不承担相应的违约责任：
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)因自然灾害、罢工、暴乱、战争、政府行为、司法行政命令等不可抗力因素;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)因电力供应故障、通讯网络故障等公共服务因素或第三方因素、用户因素;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)在本平台已尽善意管理的情况下，因常规或紧急的设备与系统维护、设备与系统故障、网络信息与数据安全等因素;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4)其他于本协议生效时不可预见的因素。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.2.2调解决定
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您理解并同意，在争议调解服务中，本平台的客服并非专业人士，仅能以普通人的认知对用户提交的凭证进行判断。因此，除存在故意或重大过失外，调解方对争议调解决定免责。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.2.3信息风险
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>在使用本平台服务过程中，您可能会遇到网络信息或其他用户行为带来的风险，该等风险包含他人匿名或冒名的含有威胁、诽谤、令人反感、非法、误导、欺骗等任何信息或行为所造成任何心理、生理上的伤害或经济损失。请您仔细甄别，并在遇到上述相关不法行为时及时向本平台或有关机关举报或投诉。本平台将对相关内容开展日常检查并在收到举报或投诉时进行相应处理，但请您注意，基于网络信息的庞杂性，本平台日常检查并不保证全面性、及时性。为此，本平台不对非本平台所发出或刊登的任何信息的真实性、适用性、合法性承担责任，也不对因第三方侵权行为给您造成的损害负责。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            5.3服务中断
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台会尽力维护平台的正常运行，向用户提供持续、稳定、安全、顺畅的服务。但用户理解并同意：本平台将尽可能在实施上述行为时予以提前公告，并尽可能将影响降低到最小。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            6.修改、终止
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本协议容许变更。如果本协议有任何实质性变更，我们将通过本软件的公告来通知您。变更通知之后，继续使用本平台则视为您已知晓此类变更并同意受条款约束。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台运营方保留在任何时候无需通知而修改、保留或关闭本平台或任何服务之权利。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您已同意本平台运营方无需因修改、保留或关闭本平台或其他服务的行为对您或第三方承担责任。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            6.2终止
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            6.2.1用户发起的终止
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您有权通过以下任一方式终止本协议：
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)您通过自助服务注销您的账户的(此种情况下，理解并同意，您已认真阅读、认可《隐私政策》及其附件一《用户注销协议》，并已了解、同意相关用户注销流程及注销后的权利义务安排)，本服务协议于账号注销之日终止;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)变更事项生效前您停止使用本平台并明示不愿接受变更事项的;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)您明示不愿继续使用本平台，且符合本平台终止条件的。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            6.2.2本平台发起的终止
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本服务协议于以下任一情形下终止</span>:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)本平台有权依据本服务协议约定，收回、注销用户账号，此情形下，本服务协议于该等账号收回、注销之日终止;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)本平台有权根据自身商业安排经过合理的提前通知终止全部本平台服务，本服务协议于本平台全部服务依法定程序及方式终止之日终止。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)本平台出于善意地相信您违反了本平台可接受使用政策或本协议的其他规定;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4)不受前款规定所限，如果您侵犯第三人的版权且本平台运营方接到版权所有人或版权所有人的合法代理人或其他有权执法、监督机关的通知后，本平台运营方保留终止本协议的权利;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            6.2.3协议终止后的处理
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            一旦本协议终止，您的账户和使用本平台的权利即告终止。本平台运营方不因终止本协议对您或任何第三方承担任何责任，包括终止您的用户账户和删除您的用户内容。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本服务协议终止后，本平台将无法继续向您提供任何服务或履行任何其他义务，包括但不限于为您保留或向您披露其原本平台账号中的任何信息，向您或第三方转发任何未曾阅读或发送过的信息等。本服务协议的终止不影响本协议约定的知识产权条款以及其他根据其内容应继续有效的条款的有效性，也不影响本服务协议终止前各方的相关权利和义务。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本协议终止后，本平台仍享有下列权利：
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)根据本协议及的相关约定，继续保存您留存于本平台的各类信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)对于您过往的违约行为，本平台仍可依据本协议向您追究违约责任。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>本协议终止后，对于您在本协议存续期间产生的交易订单，本平台可通知交易相对方并根据交易相对方的意愿决定是否关闭该等交易订单</span>;如交易相对方要求继续履行的，则您应当就该等交易订单继续履行本协议及交易订单的约定，并承担因此产生的任何损失或增加的任何费用。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.用户的违约及处理
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            发生如下情形之一的，视为您违约：
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)使用本平台服务时违反有关法律法规规定的;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)违反本协议或本协议补充协议（定义及范围见本协议第2.1条）约定的。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>为适应电子商务发展和满足海量用户对高效优质服务的需求，您理解并同意，我们可在本平台规则中约定违约认定的程序和标准。如：我们可依据您的用户数据与海量用户数据的关系来认定您是否构成违约</span>;您有义务对您的数据异常现象进行充分举证和合理解释，否则将被认定为违约。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.2违约处理措施
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.2.1信息处理
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您在本平台上发布的信息构成违约的，依据相关法律法规的规定，本平台有权或有义务立即停止相关服务，并可立即对相应信息进行删除、屏蔽处理，而无需另行通知您。本平台将根据国家相关法律法规要求，对依法删除、屏蔽的数据信息予以记录、保存。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.2.2行为限制
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您在本平台上实施的行为，或虽未在本平台上实施但对本平台及其用户产生影响的行为构成违约的，本平台有权做出独立判断并采取暂停提供部分或全部服务、取消订单、停止发货、对已发货的订单进行拦截追回、扣除账户内优惠券等虚拟产品、冻结账户内余额、查封或注销账户、终止提供服务等措施，且无需因此对您进行任何赔偿或补偿。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.2.3证据记录
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您须对自己在本平台的言论和行为承担法律责任，若您违反国家法律法规的规定，本平台的系统记录有可能作为您违反法律法规的证据，本平台有权向行政、司法机关提供上述证据记录等相关信息。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.2.4处理结果公示
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>本平台可将对您上述违约行为处理措施信息以及其他经国家行政或司法机关生效法律文书确认的违法信息在本平台上予以公示，但涉及个人信息的部分将被去标识化。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.3赔偿责任
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>如您的行为使本平台及</span>/或其关联公司遭受行政处罚或其他损失（包括自身的直接经济损失、商誉损失及对外支付的赔偿金、和解款、律师费、诉讼费等间接经济损失），您应赔偿本平台及/或其关联公司的上述全部损失。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>如您的行为使本平台及</span>/或其关联公司遭受第三人主张权利，本平台及/或其关联公司可在对第三人承担金钱给付等义务后就全部损失向您追偿。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>如因您的行为使得第三人遭受损失或您怠于履行调解决定，本平台及</span>/或其关联公司出于社会公共利益保护或消费者权益保护目的，可使用自有资金代您支付上述款项，您应当返还该部分费用并赔偿因此造成本平台的全部损失。本平台及/或关联公司也可直接抵减您在本平台及/或其关联公司其它协议项下的权益，并可继续追偿。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            此外，根据具体违法违规情形，本平台有权作出独立判断，立即暂停或终止对您提供部分或全部服务，包括但不限于锁定、注销、删除帐号等措施。<b><span>同时，您同意，如因您的行为造成他人经济损失的，本平台可出于公共利益保护、消费者保护、商业利益保护等原则，在合法合规的前提下，从您的账户</span>(如有)中划扣相应款项，您同意并授权、委托本平台进行上述划扣操作。</b>&gt;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4用户其他责任
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4.1您已同意无害的使用本平台，避免本平台运营方因下述行为或相关行为遭受来自第三方的任何投诉、诉讼、损失、损害、责任、成本和费用(包括律师费):
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)您使用本平台的行为;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)您的用户内容;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)您违反本协议的行为。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4.2本平台运营方保留专属抗辩权和请求赔偿的权利。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4.3您已同意，除非获得本平台运营方书面同意，您不得在您与本平台运营方共同对第三方提起的诉讼中单方和解。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4.4本平台运营方将尽合理努力将此类诉讼、诉讼行为或进程通知您。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            7.4.5在任何情况下，本平台都不对您或任何第三方因本协议产生的任何间接性、后果性、惩戒性的、偶然的、特殊或惩罚性的损害赔偿承担责任。访问、使用本平台所产生的损坏计算机系统或移动通讯设备数据库的风险将由您个人承担。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            8.第三方
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            8.1您已知晓或同意本平台的部分商品或服务是由第三方(简称商家)提供的，如您通过本平台购买第三方商家的商品或服务后，由商家对商品或服务质量提供保证、并提供售后服务。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            8.2本平台上商家提供的商品和服务，均以商家自身名义进行商品信息上传、展示、商品销售、发票开具、售后服务提供等;商家销售及服务出现争议、纠纷、国家机关机构调查时，由商家以销售者身份处理。本平台及运营方不参与商家商品和服务的经营。除根据相关法律法规规定外，本平台及运营方不直接介入商家与其他人(含消费者)间的争议和纠纷。如商家有违反法律法规及本协议约定行为导致任何法律后果的发生，商家将以自己的名义独立承担所有相应的法律责任，对于本平台中明确标注为自营的商品/服务，适用本平台自营商品/服务的相应服务规则。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            8.3与本平台合作的物业公司(简称“物业”)负责所管理社区内消费者在购买本平台上的商品和服务后的货品代收、代送(根据消费者要求)、问题沟通协调及处理。商品和服务质量本身导致的任何法律后果与物业无关。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            8.4您已知晓本协议是在您与本平台之间签订，而非您与第三方之间签订。本平台是基于本平台所产生的内容、维护、支持服务、保证和由此产生的诉讼等事项的唯一责任人。您已同意遵守且授权给本平台限制您有条件的使用本平台的服务。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            9.免责声明
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b><span>如发生下述情形，本平台及其运营方不承担任何法律责任</span>:</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(1)依据法律规定或相关政府部门的要求提供您的个人信息;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(2)由于您的使用不当而导致任何个人信息的泄露;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(3)任何由于黑客攻击，电脑病毒的侵入，非法内容信息、骚扰信息的屏蔽，政府管制以及其他任何网络、技术、通信线路、信息安全管理措施等原因造成的服务中断、受阻等不能满足用户要求的情形;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(4)用户因第三方，如运营商的通讯线路故障、技术问题、网络、电脑故障、系统不稳定及其他因不可抗力造成的损失的情形;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(5)由于您在违反交通法规(如驾驶车辆时)的前提下使用本软件而造成的事故及其由此产生的任何损失;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(6)使用本平台可能存在的来自他人匿名或冒名的含有威胁、诽谤、令人反感或非法内容的信息而招致的风险;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(7)用户通过本平台与其他用户交往，因受误导或欺骗而导致或可能导致的任何心理、生理上的伤害以及经济上的损失;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(8)用户操作不当;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(9)用户通过非本平台授权的方式使用本服务;</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>(10)其他本平台无法控制或合理预见的情形。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>本平台不保证为用户提供便利而设置的外部链接的准确性和完整性，同时，对于该外部链接指向的不由本平台实际控制的任何网页上的内容，本平台不承担任何责任。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本平台提示您，在使用本服务的过程中，您可能会遇到网络信息或其他用户行为带来的风险，该等风险包含他人匿名或冒名的含有威胁、诽谤、令人反感、非法、误导、欺骗等任何信息或行为所造成任何心理、生理上的伤害或经济损失。请您仔细甄别，并在遇到上述相关不法行为时及时向本平台或有关机关举报或投诉。本平台将对相关内容开展日常检查并在收到举报或投诉时进行相应处理，但请您注意，<b>本平台不对非本平台所发出或刊登的任何信息的真实性、适用性、合法性承担责任，也不对因第三方侵权行为给您造成的损害负责。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>本平台明文声明，不以明示或默示及以任何形式对本平台及其合作公司服务之及时性、安全性、准确性做出担保。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <b>除非另有明确书面说明，在符合法律法规规定的情况下，本平台不对其网站和客户端上的信息、内容、材料、产品或服务做任何形式的明示或默示的声明或担保。</b> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            10.隐私政策
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            请查阅本协议的隐私协议部分。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            11.通知
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            11.1您知悉并认可本平台发布的公告及通知毫无疑问构成有效通知。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            11.2您知悉并认可，本平台可视情况通过下列任意一种或几种方式向您通知重要信息:
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (1)向您注册时所提交的电子邮箱地址发送电子信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (2)向您注册时所提交的手机号码发送电子信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (3)向您提供的实际地址进行寄送纸质载体信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (4)在网站或客户端显著位置刊登电子信息;
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            (5)向本平台网站或相应客户端的账户的站内信或其他即时通信客户端发送电子信息。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            上述电子信息在发送成功或刊登完成后即视为送达。相关纸质载体的发送以相关邮寄凭证上的邮寄日期后的第五个自然日视为送达。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>上述送达方式同样可适用于相关仲裁或司法程序</span>(含起诉、审理、执行等各阶段)。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            您应当保证所提供的联系方式是准确、有效的，并进行适时更新，如因提供的联系方式不准确或怠于更新等不可归责于本平台的原因，导致相关通知、文件、文书无法送达或及时送达，您将自行承担由此可能产生的法律后果。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            12.适用法律及管辖
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            12.1本协议适用中华人民共和国大陆地区之法律，并且排除一切冲突法规定的适用。如法律无相关规定的，参照商业惯例及/或行业惯例。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            12.2 如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            12.3如果双方发生纠纷，应本着友好的原则协商解决;如协商不成，应向本平台运营方主要办公所在地的法院提起诉讼。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            13.独立性
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本协议中的某些条款因故无法适用，则本协议的其他条款继续适用且无法适用的条款将会被修改，以便其能够依法适用。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            14.完整性
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            14.1本协议(包括隐私政策)是您和本平台之间关于本平台相关事项的最终的、完整的、排他的协议，且取代和合并之前当事人关于此类事项(包括之前的最终用户许可、服务条款和隐私政策)的讨论和协议。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            14.2每部分的题目只为阅读之便而无任何法律或合同义务。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            14.3除非本平台运营方书面同意，您不得转让本协议所规定的权利义务。任何违反上述规定企图转让的行为均无效。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            15.权利保留
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            本协议未明示授权的其他权利仍由本平台保留，您在行使这些权利时须另外取得本平台的书面许可。本平台如果未行使前述任何权利，并不构成对该权利的放弃。
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            16.联系我们
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>地址</span>:<span>广州市天河区天河北路</span><span>890</span><span>号</span><span>1502</span><span>室</span> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>电话</span>:<span>020-22178720</span> 
        </p>
        <p class="p" style="margin-left:0.0000pt;text-indent:21.0000pt;">
            <span>邮编</span>:<span>510400</span> 
        </p>
        <p class="MsoNormal">
            &nbsp;
      </p>`,
    };
  },
};
</script>
