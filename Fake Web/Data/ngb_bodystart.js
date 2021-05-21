
function doUpdateSession()
{
	if( NgbMember.IsLogin() 	// �������� �����ϴ� ��츸, Auth Server �� UpdateSession
	&& location.href.toLowerCase().indexOf( "/localhost/" ) == -1  
	&&  location.href.toLowerCase().indexOf("?url=_comp/login_notlogin") == -1
	&&  location.href.toLowerCase().indexOf("?url=login/logout") == -1
	&&  location.href.toLowerCase().indexOf("?url=login/loginproc") == -1)
	{
		AuthSystem.UpdateSession( onUpdateResponse );
	}
}

var objUpdateInterval = null;
function onUpdateResponse( resultObject, responseXML )
{
	if( resultObject.ErrorCode == undefined )	// Auth Server �� Session �� �������� �����Ƿ�, �α׾ƿ� ó��
	{
		NgbLogin.Logout();
	}
	else if( resultObject.ErrorCode == CommonError.NoError )		// OK
	{
		window.clearInterval( objUpdateInterval );
		objUpdateInterval = setInterval( "doUpdateSession()", resultObject.UpdateInterval * 1000 );	// ExpireLimit(Second) ����, UpdateSession
	}
	else if( resultObject.ErrorCode == AuthSystemError.Disconnected )
	{
		alert( "�ٸ� ���������� �α����� �õ��Ͽ� �α׾ƿ� �˴ϴ�." );
		NgbLogin.Logout();
	}
	else if( resultObject.ErrorCode == AuthSystemError.InvalidUserIP ) {
		alert( "�α����� IP�ּҿ� ���� IP�ּҰ� ��ġ���� �ʾ� �α׾ƿ� �˴ϴ�.\r\n������ȣ�� ���� �ٽ� �α��� ���ּ���.\r\n\r\n(IP ������ �Ͼ �� �ִ� ���񽺳� ����� ����ϴ� ���, ���� �� �̿��� �ּ���.)" );
		NgbLogin.Logout();
	}
	else if ( resultObject.ErrorCode == AuthSystemError.ProtectedAccount ) {
		alert("�������� �ؽ�ID�� ���� ��ȣ���� ����Ǿ� �α׾ƿ� �Ǿ����ϴ�.\r\n�ٽ� �α����Ͻø� ����Ȯ�� �� ��й�ȣ �缳���� ���Ͽ� �����ϰ� ���� �̿��Ͻ� �� �ֽ��ϴ�.");
		NgbLogin.Logout();
	}
	else if ( resultObject.ErrorCode == AuthSystemError.InvalidReferer ) {
	}
	else
	{
		// Error ��Ȳ���� Debeg �� ���� ���� ���
/*
		Debug.Print( 'onUpdateResponse(' + resultObject._cs + ')<br>\r\n'
				+ 'resultObject.ErrorCode = ' + resultObject.ErrorCode + '<br>\r\n'	// ���(0 �� �ƴϸ� ����, ���� �ڵ� ����)
				+ 'resultObject.ErrorMessage = ' + resultObject.ErrorMessage + '<br>\r\n'
				+ 'resultObject.NewPassport = ' + resultObject.NewPassport + '<br>\r\n'
				+ 'resultObject.UnreadNoteCount = ' + resultObject.UnreadNoteCount + '<br>\r\n'
				+ 'resultObject.StatusFlag = ' + resultObject.StatusFlag + '<br>\r\n'
				+ 'resultObject.UpdateInterval = ' + resultObject.UpdateInterval + '<br>\r\n' );
*/
		alert( "�ؽ� ������Ʈ���� �α׾ƿ� �Ǿ����ϴ�. " );

		NgbLogin.Logout();
	}
}

setTimeout( "doUpdateSession()", 1 );	// ExpireLimit(Second) ����, UpdateSession

