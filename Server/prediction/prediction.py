import numpy as np
import pandas as pd
#import matplotlib.pyplot as plt
from pandas.plotting import lag_plot
import datetime as dt
from pandas import datetime
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error

#df = pd.read_csv("csv/mytest.csv")


def predictionFunc(train_data):
    #training_data, test_data = df[0:int(len(df)*0.7)], df[int(len(df)*0.7):]
    training_data = [detail["price"] for detail in train_data]
    #test_data = test_data['Price'].values
    history = [x for x in training_data]
    model_predictions = []
    jsondata = []
    old_dates = [detail["date"] for detail in train_data]
    last_day = (old_dates[(len(old_dates)-1):])[0]
    new_dates = []
    for i in range(7):
        added_day = last_day + dt.timedelta(days=(i+1))
        new_dates.append(added_day)
    #N_test_observations = len(test_data)
    N_test_observations = 7
    for time_point in range(N_test_observations):
        model = ARIMA(history, order=(1, 0, 0))
        model_fit = model.fit(disp=0)
        output = model_fit.forecast()
        yhat = output[0]
        model_predictions.append(yhat)
        #true_test_value = test_data[time_point]
        history.append(yhat)
    for i in range(len(model_predictions)):
        jsondata.append(
            {"date": new_dates[i], "price": model_predictions[i][0]})
    #MSE_error = mean_squared_error(test_data, model_predictions)
    return jsondata
    #print('Testing Mean Squared Error is {}'.format(MSE_error))

#test_set_range = df[int(len(df)*0.7):].index
#plt.plot(test_set_range, model_predictions, color='blue', marker='o', linestyle='dashed',label='Predicted Price')
#plt.plot(test_set_range, test_data, color='red', label='Actual Price')
#plt.title('Product Prices Prediction')
# plt.xlabel('Date')
# plt.ylabel('Prices')
#plt.xticks(np.arange(881,1259,50), df.Date[881:1259:50])
# plt.legend()
# plt.show()
