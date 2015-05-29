// Copyright 2007-2013 Metaio GmbH. All rights reserved.
package com.metaio.TemplateAREL;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;

import com.metaio.sdk.ARELActivity;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class ARELViewActivity extends ARELActivity 
{
	@Override
	protected int getGUILayout() 
	{
		// Attaching layout to the activity
		return R.layout.template;
	}

	public void onButtonClick(View v) 
	{
		finish();
	}

}
