<script runat="server" language="C#">
public void Page_Load()
{
	List<object> features = new List<object>();

	OleDbConnection con = new OleDbConnection(ConfigurationManager.ConnectionStrings["bikeped"].ConnectionString);
    try
    {
        con.Open();
        OleDbCommand cmd = new OleDbCommand("SELECT tbllocation.LOCATIONID,LOCATIONNAME,LAT,LOG,TOTAL1,PED1,PEDIN1,PEDOUT1,BIKE1,BIKEIN1,BIKEOUT1,TOTAL2,PED2,PEDIN2,PEDOUT2,BIKE2,BIKEIN2,BIKEOUT2,TOTAL3,PED3,PEDIN3,PEDOUT3,BIKE3,BIKEIN3,BIKEOUT3,TOTAL4,PED4,PEDIN4,PEDOUT4,BIKE4,BIKEIN4,BIKEOUT4,TOTAL5,PED5,PEDIN5,PEDOUT5,BIKE5,BIKEIN5,BIKEOUT5,TOTAL6,PED6,PEDIN6,PEDOUT6,BIKE6,BIKEIN6,BIKEOUT6,TOTAL7,PED7,PEDIN7,PEDOUT7,BIKE7,BIKEIN7,BIKEOUT7,TOTAL8,PED8,PEDIN8,PEDOUT8,BIKE8,BIKEIN8,BIKEOUT8,TOTAL9,PED9,PEDIN9,PEDOUT9,BIKE9,BIKEIN9,BIKEOUT9,TOTAL10,PED10,PEDIN10,PEDOUT10,BIKE10,BIKEIN10,BIKEOUT10,TOTAL11,PED11,PEDIN11,PEDOUT11,BIKE11,BIKEIN11,BIKEOUT11,TOTAL12,PED12,PEDIN12,PEDOUT12,BIKE12,BIKEIN12,BIKEOUT12,TO_CHAR(MONTH1,'Mon YYYY')MONTH1,TO_CHAR(MONTH2,'Mon YYYY')MONTH2,TO_CHAR(MONTH3,'Mon YYYY')MONTH3,TO_CHAR(MONTH4,'Mon YYYY')MONTH4,TO_CHAR(MONTH5,'Mon YYYY')MONTH5,TO_CHAR(MONTH6,'Mon YYYY')MONTH6,TO_CHAR(MONTH7,'Mon YYYY')MONTH7,TO_CHAR(MONTH8,'Mon YYYY')MONTH8,TO_CHAR(MONTH9,'Mon YYYY')MONTH9,TO_CHAR(MONTH10,'Mon YYYY')MONTH10,TO_CHAR(MONTH11,'Mon YYYY')MONTH11,TO_CHAR(MONTH12,'Mon YYYY')MONTH12,BIKE_YR,PED_YR FROM MonthData, tbllocation where map = 'Yes' and monthdata.locationid = tbllocation.locationid", con);
        OleDbDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
			var columns = Enumerable.Range(0, reader.FieldCount).Select(reader.GetName).ToList();
			var props = columns.Select(c => new { Key = c, Value = reader[c]}).ToDictionary(r => r.Key, r=> r.Value);
			features.Add(new { geometry = new { type = "Point", coordinates = new decimal[] { decimal.Parse(reader["log"].ToString()), decimal.Parse(reader["lat"].ToString()) } }, type = "Feature", id = int.Parse(reader["locationid"].ToString()), properties = props });
			
		}
		Response.Write(JsonConvert.SerializeObject(new { type = "FeatureCollection", features = features }));
	}
	catch (Exception e)
	{
		Response.Write(e.ToString());
	}
	finally
	{
		con.Close();
	}
}
</script>